import subprocess
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from support import (
    CSP,
    ROOM,
    SOURCE,
    accept,
    activate,
    artifact,
    fixture,
    prepare,
)
from release_engine.artifact import ReleaseError, inventory
from release_engine.system import durable_json

CRASH = Path(__file__).with_name("crash_worker.py")


@unittest.skipUnless(
    sys.platform == "linux", "actual exchange evidence requires Linux CI"
)
class EngineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-engine-")
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.engine = fixture(self.base)
        self.archive, self.envelope, self.identity = artifact(self.base)

    def initial(self):
        prepare(self.engine, self.archive, self.envelope)
        activate(self.engine, self.identity)
        accept(self.engine, self.identity)

    def test_atomic_exchange_and_first_acceptance_preserve_real_directory(self):
        original = inventory(self.engine.html)
        original_inode = self.engine.html.stat().st_ino
        prepare(self.engine, self.archive, self.envelope)
        self.assertFalse(self.engine.html.is_symlink())
        activate(self.engine, self.identity)
        self.assertTrue(self.engine.html.is_symlink())
        migration = self.engine.status()["migration"]
        swap = self.engine.root / migration["swap"]
        self.assertEqual(swap.stat().st_ino, original_inode)
        self.assertEqual(inventory(swap), original)
        self.assertEqual(
            (self.engine.html / ".well-known/acme-challenge/fixture").read_bytes(),
            b"public challenge fixture",
        )
        self.assertEqual(self.engine.html.resolve().stat().st_mode & 0o777, 0o755)
        self.assertEqual(self.engine.private.stat().st_mode & 0o777, 0o700)
        accept(self.engine, self.identity)
        self.assertTrue(swap.exists())
        self.engine.cleanup()
        self.assertFalse(swap.exists())

    def test_no_root_gap_during_real_exchange_and_switch(self):
        prepare(self.engine, self.archive, self.envelope)
        stop = threading.Event()
        failures = []
        reads = []

        def reader():
            while not stop.is_set():
                try:
                    reads.append((self.engine.html / "index.html").read_bytes())
                except OSError as exc:
                    failures.append(type(exc).__name__)

        thread = threading.Thread(target=reader)
        thread.start()
        try:
            activate(self.engine, self.identity)
            self.engine.recover(self.identity["build_id"])
        finally:
            stop.set()
            thread.join(timeout=2)
        self.assertTrue(reads)
        self.assertEqual(failures, [])

    def test_subsequent_activation_does_not_exchange_real_directory(self):
        self.initial()
        archive, envelope, identity = artifact(self.base, run=2, version="three")
        prepare(self.engine, archive, envelope)
        with patch(
            "release_engine.engine.exchange",
            side_effect=AssertionError("second exchange"),
        ):
            activate(self.engine, identity)
        accept(self.engine, identity)
        self.assertEqual(self.engine.status()["accepted"], identity["build_id"])

    def test_old_chunks_fonts_images_and_pdfs_survive_forward_and_rollback(self):
        self.initial()
        archive, envelope, identity = artifact(self.base, run=2, version="three")
        prepare(self.engine, archive, envelope)
        activate(self.engine, identity)
        for version in ("one", "two", "three"):
            self.assertTrue(
                (self.engine.html / f"_astro/Resume.{version}12345678.pdf").is_file()
            )
        self.engine.recover(identity["build_id"])
        for name in ("main", "lazy", "image", "font", "Resume"):
            extension = {"image": "webp", "font": "woff2", "Resume": "pdf"}.get(
                name, "js"
            )
            self.assertTrue(
                (
                    self.engine.html / f"_astro/{name}.three12345678.{extension}"
                ).is_file()
            )
        self.assertEqual(self.engine.status()["last"]["outcome"], "failed")

    def test_recovered_then_explicit_older_rollback_keeps_newest_exposed_assets(self):
        self.initial()
        archive_b, envelope_b, identity_b = artifact(self.base, run=2, version="three")
        prepare(self.engine, archive_b, envelope_b)
        activate(self.engine, identity_b)
        accept(self.engine, identity_b)
        archive_c, envelope_c, identity_c = artifact(self.base, run=3, version="four")
        prepare(self.engine, archive_c, envelope_c)
        activate(self.engine, identity_c)
        self.engine.recover(identity_c["build_id"])
        self.engine.recover(
            identity_b["build_id"], target=self.engine.status()["previous"]
        )
        self.assertIn(b"two", (self.engine.html / "index.html").read_bytes())
        self.assertTrue((self.engine.html / "_astro/main.four12345678.js").exists())
        self.assertTrue((self.engine.html / "_astro/Resume.four12345678.pdf").exists())

    def test_new_stable_resource_rejected_instead_of_lost_on_rollback(self):
        from release_engine.artifact import load_json, pack

        source = self.base / "source-1-1"
        (source / "feature.js").write_text("window.feature=true;")
        html = source / "index.html"
        html.write_text(html.read_text() + '<script src="/feature.js"></script>')
        pack(
            source,
            self.base / "stable-added.gz",
            self.base / "stable-added.json",
            SOURCE,
            2,
            1,
        )
        with self.assertRaisesRegex(ReleaseError, "unversioned resource set"):
            prepare(
                self.engine,
                self.base / "stable-added.gz",
                load_json(self.base / "stable-added.json"),
            )
        self.assertFalse((self.engine.html / "feature.js").exists())

    def test_bootstrap_copy_interruption_retries_without_touching_serving_bytes(self):
        original = inventory(self.engine.html)
        result = subprocess.run(
            [
                sys.executable,
                "-B",
                str(CRASH),
                str(self.engine.root),
                "during_bootstrap_copy",
                "prepare",
                str(self.archive),
                str(self.base / "build-1-1.json"),
            ],
            capture_output=True,
            timeout=40,
        )
        self.assertEqual(result.returncode, 77, result.stderr.decode())
        self.assertIsNone(self.engine.status()["pending"])
        self.assertEqual(inventory(self.engine.html), original)
        prepare(self.engine, self.archive, self.envelope)
        activate(self.engine, self.identity)
        accept(self.engine, self.identity)

    def test_prepared_and_accept_journal_crashes_remain_reconcilable(self):
        for label in ("after_bootstrap_copy", "before_prepared", "after_prepared"):
            with self.subTest(label=label), tempfile.TemporaryDirectory(
                prefix="release-prepare-crash-"
            ) as tmp:
                engine = fixture(Path(tmp))
                result = subprocess.run(
                    [
                        sys.executable,
                        "-B",
                        str(CRASH),
                        str(engine.root),
                        label,
                        "prepare",
                        str(self.archive),
                        str(self.base / "build-1-1.json"),
                    ],
                    capture_output=True,
                    timeout=40,
                )
                self.assertEqual(result.returncode, 77, result.stderr.decode())
                self.assertFalse(engine.html.is_symlink())
                if engine.status()["pending"]:
                    engine.recover(self.identity["build_id"])
        for label in ("before_accepted", "after_accepted"):
            with self.subTest(label=label), tempfile.TemporaryDirectory(
                prefix="release-accept-crash-"
            ) as tmp:
                engine = fixture(Path(tmp))
                prepare(engine, self.archive, self.envelope)
                activate(engine, self.identity)
                result = subprocess.run(
                    [
                        sys.executable,
                        "-B",
                        str(CRASH),
                        str(engine.root),
                        label,
                        "accept",
                    ],
                    capture_output=True,
                    timeout=40,
                )
                self.assertEqual(result.returncode, 77, result.stderr.decode())
                if engine.status()["pending"]:
                    engine.recover(self.identity["build_id"])
                else:
                    self.assertEqual(engine.status()["last"]["outcome"], "accepted")

    def test_capacity_denial_and_unsupported_exchange_do_not_clear_root(self):
        original = inventory(self.engine.html)
        self.engine.capacity_provider = lambda _root: (0, 0, 0)
        with self.assertRaises(ReleaseError):
            prepare(self.engine, self.archive, self.envelope)
        self.assertEqual(inventory(self.engine.html), original)
        self.engine.capacity_provider = ROOM
        prepare(self.engine, self.archive, self.envelope)
        with patch(
            "release_engine.engine.exchange", side_effect=ReleaseError("unsupported")
        ):
            with self.assertRaises(ReleaseError):
                activate(self.engine, self.identity)
        self.assertEqual(inventory(self.engine.html), original)
        self.engine.recover(self.identity["build_id"])
        self.assertEqual(inventory(self.engine.html), original)

    def test_collision_and_unversioned_change_refused(self):
        for number, path in enumerate(
            ("js/stable.js", "_astro/main.one12345678.js"), 2
        ):
            archive, envelope, _ = artifact(self.base, run=number, version="one")
            # Independent synthetic source and repack, not a forged unbound hash.
            source = self.base / f"source-{number}-1"
            (source / path).write_text("window.changed=true;")
            from release_engine.artifact import load_json, pack

            output = self.base / f"changed-{number}.gz"
            metadata = self.base / f"changed-{number}.json"
            pack(source, output, metadata, SOURCE, number, 1)
            with self.subTest(path=path), self.assertRaisesRegex(
                ReleaseError, "unversioned|collision"
            ):
                prepare(self.engine, output, load_json(metadata))
        self.assertFalse(self.engine.html.is_symlink())

    def test_manifest_retention_quota_refuses_before_activation(self):
        state = self.engine._load()
        state["retired"] = {
            str(i): {"at": time.time(), "assets": {}} for i in range(20)
        }
        durable_json(self.engine.state_path, state)
        with self.assertRaisesRegex(ReleaseError, "quota"):
            prepare(self.engine, self.archive, self.envelope)
        self.assertFalse(self.engine.html.is_symlink())

    def test_asset_union_quota_and_preserved_well_known(self):
        with patch("release_engine.engine.ASSET_LIMIT", 1):
            with self.assertRaisesRegex(ReleaseError, "union"):
                prepare(self.engine, self.archive, self.envelope)
        self.assertTrue(
            (self.engine.html / ".well-known/acme-challenge/fixture").exists()
        )

    def test_stale_master_cas_and_pending_rejection(self):
        expected = self.engine.status()["serving"]
        for master, previous in (("b" * 40, expected), (SOURCE, "wrong")):
            with self.assertRaises(ReleaseError):
                self.engine.prepare(
                    self.archive,
                    self.envelope,
                    expected=previous,
                    fresh_master=master,
                    csp=CSP,
                )
        prepare(self.engine, self.archive, self.envelope)
        with self.assertRaises(ReleaseError):
            self.engine.activate(
                self.identity["build_id"], expected=expected, fresh_master="b" * 40
            )
        archive, envelope, _ = artifact(self.base, run=2)
        with self.assertRaisesRegex(ReleaseError, "unresolved"):
            prepare(self.engine, archive, envelope)

    def test_exact_prepare_accept_retries_and_late_ack(self):
        prepare(self.engine, self.archive, self.envelope)
        prepare(self.engine, self.archive, self.envelope)
        activate(self.engine, self.identity)
        accept(self.engine, self.identity)
        accept(self.engine, self.identity)
        self.engine.prepare(
            self.archive, self.envelope, expected="unused", fresh_master=SOURCE, csp=CSP
        )
        self.engine.recover(
            self.identity["build_id"], target=self.engine.status()["previous"]
        )
        with self.assertRaisesRegex(ReleaseError, "late"):
            accept(self.engine, self.identity)

    def test_failed_acceptance_and_deadline_leave_guard_recovery_possible(self):
        prepare(self.engine, self.archive, self.envelope)
        activate(self.engine, self.identity)
        with self.assertRaisesRegex(ReleaseError, "acceptance failed"):
            self.engine.accept(
                self.identity["build_id"],
                {"identity": self.identity, "origin": False, "browser": True},
            )
        self.engine.clock = lambda: time.time() + 200
        with self.assertRaisesRegex(ReleaseError, "deadline"):
            accept(self.engine, self.identity)
        self.engine.recover(self.identity["build_id"])
        self.assertEqual(self.engine.status()["last"]["phase"], "recovered")

    def test_late_guard_and_explicit_target_cannot_revert_newer_generation(self):
        self.initial()
        archive, envelope, identity = artifact(self.base, run=2, version="three")
        prepare(self.engine, archive, envelope)
        activate(self.engine, identity)
        accept(self.engine, identity)
        with self.assertRaises(ReleaseError):
            self.engine.recover(self.identity["build_id"])
        with self.assertRaises(ReleaseError):
            self.engine.recover(identity["build_id"], target="arbitrary")
        self.assertEqual(self.engine.status()["accepted"], identity["build_id"])

    def test_cleanup_protects_pending_previous_and_failed_staging(self):
        prepare(self.engine, self.archive, self.envelope)
        with self.assertRaises(ReleaseError):
            self.engine.cleanup()
        activate(self.engine, self.identity)
        accept(self.engine, self.identity)
        failed = self.engine.views / "failed-staging"
        failed.mkdir()
        self.engine.cleanup()
        self.assertTrue(failed.exists())
        self.assertTrue(self.engine._path(self.engine.status()["previous"]).exists())
        self.engine.clock = lambda: time.time() + 86401
        self.engine.cleanup()
        self.assertFalse(failed.exists())

    def test_cleanup_failure_is_visible_without_erasing_serving_state(self):
        self.initial()
        original = self.engine.status()["accepted"]
        with patch("release_engine.engine.shutil.rmtree", side_effect=PermissionError):
            with self.assertRaisesRegex(ReleaseError, "cleanup failed"):
                self.engine.cleanup()
        self.assertEqual(self.engine.status()["accepted"], original)
        self.assertEqual(self.engine.status()["cleanup"], "failed")
        self.engine._verify(original)

    def test_real_concurrent_activation_only_one_wins(self):
        prepare(self.engine, self.archive, self.envelope)
        args = [
            sys.executable,
            "-B",
            str(CRASH),
            str(self.engine.root),
            "none",
            "activate",
        ]
        one = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        two = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        self.addCleanup(lambda: one.kill() if one.poll() is None else None)
        self.addCleanup(lambda: two.kill() if two.poll() is None else None)
        one.communicate(timeout=40)
        two.communicate(timeout=40)
        self.assertEqual(sorted([one.returncode, two.returncode]), [0, 2])
        self.engine.recover(self.identity["build_id"])

    def test_crashes_at_all_durable_activation_and_recovery_boundaries(self):
        labels = [
            "before_armed",
            "after_armed",
            "after_guard",
            "before_migration_journal",
            "after_migration_journal",
            "before_exchange",
            "after_exchange",
            "before_migrated",
            "after_migrated",
            "before_activation_journal",
            "after_activation_journal",
            "before_pointer",
            "after_pointer",
            "before_active",
            "after_active",
        ]
        for index, label in enumerate(labels):
            with self.subTest(label=label), tempfile.TemporaryDirectory(
                prefix="release-crash-"
            ) as tmp:
                base = Path(tmp)
                engine = fixture(base)
                prepare(engine, self.archive, self.envelope)
                result = subprocess.run(
                    [
                        sys.executable,
                        "-B",
                        str(CRASH),
                        str(engine.root),
                        label,
                        "activate",
                    ],
                    capture_output=True,
                    timeout=40,
                )
                self.assertEqual(result.returncode, 77, result.stderr.decode())
                engine.recover(self.identity["build_id"])
                self.assertIsNone(engine.status()["pending"])
                self.assertIn(b"one", (engine.html / "index.html").read_bytes())
        for label in (
            "before_recovery_journal",
            "after_recovery_journal",
            "after_recovery_pointer",
            "before_recovered",
            "after_recovered",
        ):
            with self.subTest(label=label), tempfile.TemporaryDirectory(
                prefix="release-recover-"
            ) as tmp:
                engine = fixture(Path(tmp))
                prepare(engine, self.archive, self.envelope)
                activate(engine, self.identity)
                result = subprocess.run(
                    [
                        sys.executable,
                        "-B",
                        str(CRASH),
                        str(engine.root),
                        label,
                        "recover",
                    ],
                    capture_output=True,
                    timeout=40,
                )
                self.assertEqual(result.returncode, 77, result.stderr.decode())
                engine.recover(self.identity["build_id"])
                self.assertIsNone(engine.status()["pending"])


if __name__ == "__main__":
    unittest.main()
