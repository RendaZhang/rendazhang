import gzip
import io
import json
import subprocess
import sys
import tarfile
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch
from resource_monitor import ProcessMemory

from support import CSP, artifact
from release_engine.artifact import (
    ARCHIVE_LIMIT,
    BASE_LIMIT,
    IDENTITY,
    ReleaseError,
    canonical,
    digest,
    hash_file,
    inventory,
    is_hashed,
    load_json,
    safe_path,
    unpack,
    validate_envelope,
    validate_site,
)
from release_engine.system import (
    admit,
    fsync_dir,
    DISK_RESERVE,
    PEAK_DISK,
    MEMORY_GATE,
    PROCESS_MEMORY_BUDGET,
    PHYSICAL_MEMORY_RESERVE,
)
from release_engine.protocol import MIB


class ArtifactTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-artifact-")
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.archive, self.envelope, self.identity = artifact(self.base)

    def malformed(self, members):
        output = self.base / "bad.tar.gz"
        with tarfile.open(output, "w:gz", format=tarfile.USTAR_FORMAT) as tar:
            for member, content in members:
                tar.addfile(member, io.BytesIO(content) if member.isfile() else None)
        envelope = dict(
            self.envelope,
            archive_sha256=hash_file(output),
            archive_bytes=output.stat().st_size,
        )
        return output, envelope

    def test_roundtrip_canonical_identity(self):
        unpack(self.archive, self.envelope, self.base / "out")
        self.assertEqual(
            inventory(self.base / "out"), self.envelope["payload"]["files"]
        )
        validate_site(self.base / "out", inventory(self.base / "out"), CSP)
        self.assertNotIn(IDENTITY, self.envelope["payload"]["files"])
        self.assertEqual(
            self.envelope["payload_sha256"], digest(canonical(self.envelope["payload"]))
        )

    def test_memory_monitor_failure_is_not_hidden_by_partial_samples(self):
        monitor = ProcessMemory("/fixture", "unit-prefix")
        monitor.samples.append(100)
        with patch("resource_monitor.subprocess.run", side_effect=OSError("ps failed")):
            with self.assertRaisesRegex(RuntimeError, "monitor failed"):
                with monitor:
                    monitor.thread.join(timeout=5)

    def test_outer_cli_supervision_does_not_import_or_construct_engine(self):
        script = Path(__file__).resolve().parents[2] / "scripts/release.py"
        code = """
import runpy, sys
from pathlib import Path
script, root = sys.argv[1:]
sys.path.insert(0, str(Path(script).parent))
module = runpy.run_path(script)
def worker(*args):
    assert 'release_engine.engine' not in sys.modules
    assert 'release_engine.artifact' not in sys.modules
    assert not (Path(root) / '.release-state').exists()
    assert '--manifest' in args[2]
    return {'schema': 1, 'last': None}
module['main'].__globals__['run_worker'] = worker
sys.argv = [script, 'prepare', '--root', root, '--manifest', 'worker-validates-this']
assert module['main']() == 0
"""
        result = subprocess.run(
            [sys.executable, "-B", "-c", code, str(script), str(self.base)],
            capture_output=True,
            timeout=10,
        )
        self.assertEqual(result.returncode, 0, result.stderr.decode())

    def test_guard_ready_reuse_requires_transaction_and_deadline_match(self):
        from release_engine.system import SystemdGuard, durable_json, guard_receipt

        root = self.base / "guard-root"
        private = root / ".release-state"
        private.mkdir(parents=True)
        pending = {
            "id": "fixture",
            "guard_token": "new-token",
            "worker_key": "fixture-new",
            "deadline": 100,
            "recover_by": 160,
        }
        durable_json(private / "state.json", {"pending": pending})
        ready = private / "fixture.ready"
        old = dict(guard_receipt(pending), token="old-token", deadline=1)
        durable_json(ready, old)

        def command(args):
            if args[0] == "systemd-run":
                durable_json(ready, guard_receipt(pending))
            return "active"

        with patch(
            "release_engine.system.subprocess.run",
            return_value=subprocess.CompletedProcess([], 0),
        ), patch("release_engine.system.command", side_effect=command) as execute:
            SystemdGuard().arm(root, "fixture")
            self.assertTrue(
                any(
                    call.args[0][:2] == ["systemctl", "stop"]
                    for call in execute.call_args_list
                )
            )
            execute.reset_mock()
            SystemdGuard().arm(root, "fixture")
            execute.assert_not_called()

    def test_cli_new_operation_does_not_inherit_previous_failed_outcome(self):
        import contextlib
        import runpy

        script = Path(__file__).resolve().parents[2] / "scripts/release.py"
        main = runpy.run_path(str(script))["main"]
        failed = {"id": "older", "outcome": "failed", "phase": "recovered"}
        for action, phase in (("prepare", "prepared"), ("activate", "active")):
            for internal in (False, True):
                state = {
                    "schema": 1,
                    "pending": {"id": "new", "phase": phase},
                    "last": failed,
                }
                argv = [
                    str(script),
                    "worker" if internal else action,
                    "--root",
                    str(self.base),
                ]
                if internal:
                    argv.extend(["--operation", action])
                with self.subTest(action=action, internal=internal), patch.object(
                    sys, "argv", argv
                ), patch.dict(main.__globals__, run_worker=lambda *_: state), patch(
                    "release_engine.engine.Engine"
                ) as engine, patch.dict(
                    main.__globals__, load_json=lambda *_: {"script_hashes": []}
                ), contextlib.redirect_stdout(
                    io.StringIO()
                ):
                    getattr(engine.return_value, action).return_value = state
                    self.assertEqual(main(), 0)
                    self.assertEqual(state["last"], failed)

        for action in ("recover", "cleanup", "status", "guard"):
            for internal in (
                (False, True) if action in ("recover", "cleanup") else (False,)
            ):
                state = {"schema": 1, "pending": None, "last": failed}
                argv = [
                    str(script),
                    "worker" if internal else action,
                    "--root",
                    str(self.base),
                ]
                if internal:
                    argv.extend(["--operation", action])
                with self.subTest(action=action, internal=internal), patch.object(
                    sys, "argv", argv
                ), patch.dict(main.__globals__, run_worker=lambda *_: state), patch(
                    "release_engine.engine.Engine"
                ) as engine, contextlib.redirect_stdout(
                    io.StringIO()
                ):
                    getattr(engine.return_value, action).return_value = state
                    engine.return_value.status.return_value = state
                    self.assertEqual(main(), 2)

        for action in ("prepare", "activate"):
            for internal in (False, True):
                argv = [
                    str(script),
                    "worker" if internal else action,
                    "--root",
                    str(self.base),
                ]
                if internal:
                    argv.extend(["--operation", action])
                with self.subTest(rejected=action, internal=internal), patch.object(
                    sys, "argv", argv
                ), patch.dict(
                    main.__globals__, load_json=lambda *_: {"script_hashes": []}
                ), patch(
                    "release_engine.engine.Engine"
                ) as engine, patch.dict(
                    main.__globals__,
                    run_worker=Mock(side_effect=ReleaseError("rejected")),
                ), contextlib.redirect_stderr(
                    io.StringIO()
                ):
                    getattr(engine.return_value, action).side_effect = ReleaseError(
                        "rejected"
                    )
                    self.assertEqual(main(), 2)

    def test_supervisor_preserves_controlled_worker_rejection(self):
        from release_engine.system import run_worker

        result = subprocess.CompletedProcess(
            [],
            2,
            "",
            json.dumps({"ok": False, "error": "incompatible unversioned resource set"}),
        )
        with patch("release_engine.system.subprocess.run", return_value=result):
            with self.assertRaisesRegex(
                ReleaseError, "incompatible unversioned resource set"
            ):
                run_worker(self.base, "fixture", [])

    def test_rebuild_has_distinct_identity(self):
        _, _, second = artifact(self.base, attempt=2)
        self.assertNotEqual(self.identity["build_id"], second["build_id"])
        self.assertEqual(self.identity["source_sha"], second["source_sha"])

    def test_unknown_fields_and_invalid_identity(self):
        for key, value in (
            ("secret", "not accepted"),
            ("archive_bytes", ARCHIVE_LIMIT + 1),
            ("archive_sha256", "no"),
            ("payload_sha256", "0" * 64),
        ):
            with self.subTest(key=key), self.assertRaises(ReleaseError):
                validate_envelope(dict(self.envelope, **{key: value}))

    def test_payload_limits_and_required_routes(self):
        for update in (
            {"run_id": True},
            {"source_sha": "bad"},
            {"attempt": 0},
            {"files": {}},
            {"schema": 2},
        ):
            payload = dict(self.envelope["payload"], **update)
            envelope = dict(
                self.envelope,
                payload=payload,
                payload_sha256=digest(canonical(payload)),
            )
            with self.subTest(update=update), self.assertRaises(ReleaseError):
                validate_envelope(envelope)

    def test_escaping_private_reserved_paths(self):
        for path in (
            "../x",
            "/x",
            "a/../x",
            "a//b",
            "a\\b",
            "a\x00b",
            ".env",
            ".git/config",
            "a.map",
            IDENTITY,
        ):
            with self.subTest(path=path), self.assertRaises(ReleaseError):
                safe_path(path)
        self.assertEqual(
            safe_path(".well-known/acme-challenge/x"), ".well-known/acme-challenge/x"
        )

    def test_json_duplicate_and_size_limits(self):
        path = self.base / "duplicate.json"
        path.write_text('{"key":1,"key":2}')
        with self.assertRaises(ReleaseError):
            load_json(path)
        with self.assertRaises(ReleaseError):
            load_json(path, limit=1)

    def test_corrupt_and_interrupted_upload(self):
        for data in (b"broken", self.archive.read_bytes()[:100]):
            bad = self.base / "truncated.gz"
            bad.write_bytes(data)
            with self.assertRaises(ReleaseError):
                unpack(bad, self.envelope, self.base / "no-output")
            self.assertFalse((self.base / "no-output").exists())

    def test_member_link_special_duplicate_and_traversal(self):
        for index, kind in enumerate(
            (
                tarfile.SYMTYPE,
                tarfile.LNKTYPE,
                tarfile.FIFOTYPE,
                tarfile.CHRTYPE,
                tarfile.DIRTYPE,
            )
        ):
            member = tarfile.TarInfo("index.html")
            member.type, member.mode, member.linkname = kind, 0o644, "../outside"
            archive, envelope = self.malformed([(member, b"")])
            with self.subTest(kind=kind), self.assertRaises(ReleaseError):
                unpack(archive, envelope, self.base / f"special-{index}")
        for index, name in enumerate(("../outside", "/outside")):
            member = tarfile.TarInfo(name)
            member.mode = 0o644
            archive, envelope = self.malformed([(member, b"")])
            with self.assertRaises(ReleaseError):
                unpack(archive, envelope, self.base / f"escape-{index}")

    def test_duplicate_and_missing_and_hash_mismatch(self):
        source = self.base / "source-1-1"
        members = []
        for path, entry in self.envelope["payload"]["files"].items():
            member = tarfile.TarInfo(path)
            member.mode, member.size = 0o644, entry["bytes"]
            members.append((member, (source / path).read_bytes()))
        for label, listing in (
            ("duplicate", members + [members[0]]),
            ("missing", members[:-1]),
            ("hash", [(members[0][0], b"!" * members[0][0].size)] + members[1:]),
        ):
            archive, envelope = self.malformed(listing)
            with self.subTest(label=label), self.assertRaises(ReleaseError):
                unpack(archive, envelope, self.base / label)

    def test_metadata_bomb_rejected_before_body_allocation(self):
        for index, kind in enumerate(
            (tarfile.XHDTYPE, tarfile.XGLTYPE, tarfile.GNUTYPE_LONGNAME)
        ):
            member = tarfile.TarInfo("metadata")
            member.type, member.mode, member.size = kind, 0o644, 1024**3
            path = self.base / f"metadata-{index}.gz"
            # A 1 GiB advertised extension plus highly compressed metadata, not a 1 GiB allocation.
            with gzip.open(path, "wb") as stream:
                stream.write(member.tobuf(format=tarfile.USTAR_FORMAT))
                for _ in range(1024):
                    stream.write(bytes(65536))
            envelope = dict(
                self.envelope,
                archive_sha256=hash_file(path),
                archive_bytes=path.stat().st_size,
            )
            with self.assertRaisesRegex(ReleaseError, "noncanonical"):
                unpack(path, envelope, self.base / f"metadata-out-{index}")

    def test_decompressed_padding_bomb_bounded(self):
        path = self.base / "padding.gz"
        with gzip.open(path, "wb") as stream:
            for _ in range(600):
                stream.write(bytes(65536))
        envelope = dict(
            self.envelope,
            archive_sha256=hash_file(path),
            archive_bytes=path.stat().st_size,
        )
        with self.assertRaisesRegex(ReleaseError, "decompressed"):
            unpack(path, envelope, self.base / "padding")

    def test_large_advertised_file_refused_without_body(self):
        member = tarfile.TarInfo("index.html")
        member.mode, member.size = 0o644, BASE_LIMIT + 1
        path = self.base / "oversize.gz"
        with gzip.open(path, "wb") as stream:
            stream.write(member.tobuf())
        envelope = dict(
            self.envelope,
            archive_sha256=hash_file(path),
            archive_bytes=path.stat().st_size,
        )
        with self.assertRaises(ReleaseError):
            unpack(path, envelope, self.base / "oversize")

    def test_tree_links_permissions_and_count(self):
        source = self.base / "source-1-1"
        (source / "link").symlink_to("index.html")
        with self.assertRaises(ReleaseError):
            inventory(source)
        (source / "link").unlink()
        (source / "index.html").chmod(0o666)
        with self.assertRaises(ReleaseError):
            inventory(source)
        (source / "index.html").chmod(0o644)
        with self.assertRaises(ReleaseError):
            inventory(source, count=1)

    def test_literal_url_assets_workers_and_nested_resolution_base(self):
        source = self.base / "source-1-1"
        file = source / "_astro/main.two12345678.js"
        file.write_text("""
          const image = new URL('./image.two12345678.webp', import.meta.url);
          new Worker(new URL('./lazy.two12345678.js', import.meta.url));
          new Worker(new URL('lazy.two12345678.js', new URL('./', import.meta.url)));
          function resolve(e) { return new URL(e, new URL('../../../src/node/plugins/importAnalysisBuild.ts', import.meta.url)); }
        """)
        parser = (
            Path(__file__).resolve().parents[2] / "scripts/release-dependencies.mjs"
        )
        result = subprocess.run(
            ["node", str(parser), str(source)],
            capture_output=True,
            check=True,
            timeout=30,
        )
        graph = json.loads(result.stdout)
        self.assertEqual(
            graph["_astro/main.two12345678.js"],
            ["_astro/image.two12345678.webp", "_astro/lazy.two12345678.js"],
        )
        validate_site(source, inventory(source), CSP, graph)
        for missing in graph["_astro/main.two12345678.js"]:
            with self.subTest(missing=missing), self.assertRaisesRegex(
                ReleaseError, "resource missing"
            ):
                validate_site(
                    source,
                    {p: e for p, e in inventory(source).items() if p != missing},
                    CSP,
                    graph,
                )

    def test_csp_and_hydration_and_lazy_dependency_failures(self):
        source = self.base / "source-1-1"
        files = inventory(source)
        with self.assertRaisesRegex(ReleaseError, "CSP"):
            validate_site(source, files, set())
        for path in (
            "_astro/main.two12345678.js",
            "_astro/lazy.two12345678.js",
            "_astro/image.two12345678.webp",
        ):
            with self.subTest(path=path), self.assertRaisesRegex(
                ReleaseError, "resource missing"
            ):
                validate_site(
                    source, {p: e for p, e in files.items() if p != path}, CSP
                )

    def test_vite_mapdeps_and_hashed_downloads(self):
        source = self.base / "source-1-1"
        file = source / "_astro/main.two12345678.js"
        file.write_text(
            'const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/absent.hash12345.js"])))=>i.map(i=>d[i]);'
        )
        parser = (
            Path(__file__).resolve().parents[2] / "scripts/release-dependencies.mjs"
        )
        result = subprocess.run(
            ["node", str(parser), str(source)],
            capture_output=True,
            check=True,
            timeout=30,
        )
        with self.assertRaisesRegex(ReleaseError, "resource missing"):
            validate_site(source, inventory(source), CSP, json.loads(result.stdout))
        self.assertTrue(is_hashed("_astro/Resume_RendaZhang.hash12345.pdf"))
        self.assertTrue(is_hashed("_astro/\u7b80\u5386.hash12345.pdf"))

    def test_runtime_template_strings_are_not_static_css_dependencies(self):
        source = self.base / "source-1-1"
        file = source / "_astro/main.two12345678.js"
        file.write_text(
            'const a=`url(${t}-gradient)`; const b="url(,)"; '
            "const c=`url(${i}#${a}_${o}-${s}${c})`; "
            'const d="url(`+this.href+`)";'
        )
        parser = (
            Path(__file__).resolve().parents[2] / "scripts/release-dependencies.mjs"
        )
        result = subprocess.run(
            ["node", str(parser), str(source)],
            capture_output=True,
            check=True,
            timeout=30,
        )
        dependencies = json.loads(result.stdout)
        self.assertEqual(dependencies["_astro/main.two12345678.js"], [])
        validate_site(source, inventory(source), CSP, dependencies)

    def test_capacity_boundaries(self):
        self.assertEqual(PROCESS_MEMORY_BUDGET, 96 * MIB)
        self.assertEqual(PHYSICAL_MEMORY_RESERVE, 128 * MIB)
        self.assertEqual(MEMORY_GATE, 224 * MIB)
        passing = (DISK_RESERVE + PEAK_DISK, 130000, MEMORY_GATE)
        admit(passing)
        for memory in (192 * MIB, 224 * MIB - 1):
            with self.subTest(memory=memory), self.assertRaisesRegex(
                ReleaseError, "insufficient physical memory"
            ):
                admit((passing[0], passing[1], memory))
        for index in range(3):
            values = list(passing)
            values[index] -= 1
            with self.subTest(index=index), self.assertRaises(ReleaseError):
                admit(tuple(values))

    def test_directory_fd_closed_on_success_and_failure(self):
        for failure in (False, True):
            with patch("release_engine.system.os.open", return_value=123), patch(
                "release_engine.system.os.close"
            ) as close, patch(
                "release_engine.system.os.fsync",
                side_effect=OSError if failure else None,
            ):
                if failure:
                    with self.assertRaises(OSError):
                        fsync_dir(self.base)
                else:
                    fsync_dir(self.base)
                close.assert_called_once_with(123)


if __name__ == "__main__":
    unittest.main()
