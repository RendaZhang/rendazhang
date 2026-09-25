import contextlib
import base64
import fcntl
import io
import os
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from support import SOURCE
from release_bootstrap import install
from release_bundle import helper_package
from release_engine.protocol import canonical, digest
from release_engine.system import durable_json


class BootstrapTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-bootstrap-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve() / "host"
        self.tools = self.root / ".release-state" / "tools"
        self.tools.mkdir(parents=True, mode=0o700)
        self.root.chmod(0o700)
        self.tools.parent.chmod(0o700)
        self.package = helper_package()

    def install(self):
        original = Path.read_text

        def read_text(path, *args, **kwargs):
            if path == Path("/proc/meminfo"):
                return "MemAvailable: 1048576 kB\n"
            return original(path, *args, **kwargs)

        stream = io.TextIOWrapper(io.BytesIO(canonical(self.package)))
        # Capacity uses a synthetic memory fixture locally; hard timeouts are tested on Linux.
        with patch.object(
            sys, "argv", ["bootstrap", str(self.root), self.package["sha256"]]
        ), patch.object(sys, "stdin", stream), patch(
            "pathlib.Path.read_text", read_text
        ), patch(
            "signal.alarm"
        ), contextlib.redirect_stdout(
            io.StringIO()
        ):
            install()

    def test_immutable_reuse_verifies_every_file(self):
        self.install()
        target = self.tools / self.package["sha256"]
        original = (target / "release.py").read_bytes()
        self.install()
        self.assertEqual((target / "release.py").read_bytes(), original)
        (target / "release.py").chmod(0o600)
        (target / "release.py").write_text("tampered fixture")
        with self.assertRaisesRegex(RuntimeError, "immutable helper"):
            self.install()

    def test_old_owned_partial_pairs_expire_before_install_cap_preserving_references(
        self,
    ):
        protected = [f"{number:064x}" for number in range(1, 5)]
        private = self.tools.parent
        durable_json(private / "lease.json", {"helper": protected[0]})
        durable_json(
            private / "state.json",
            {
                "accepted": "accepted",
                "previous": "previous",
                "pending": {"http": {"helper": protected[1]}},
            },
        )
        for label, helper in zip(("accepted", "previous"), protected[2:]):
            durable_json(private / (label + ".json"), {"identity": {"build_id": label}})
            durable_json(private / (label + ".http.json"), {"helper": helper})
        old = time.time() - 86402
        for number in range(1, 36):
            name = f"{number:064x}"
            intent = self.tools / (name + ".intent")
            intent.write_text(name)
            partial = self.tools / (name + ".partial")
            partial.mkdir()
            (partial / "release.py").write_text("incomplete fixture")
            os.utime(intent, (old, old))
            os.utime(partial, (old, old))
        unknown = self.tools / "unowned-note"
        unknown.write_text(SOURCE)
        self.install()
        self.assertTrue(unknown.exists())
        for helper in protected:
            self.assertTrue((self.tools / (helper + ".intent")).exists())
            self.assertTrue((self.tools / (helper + ".partial")).exists())
        self.assertEqual(len(list(self.tools.glob("*.intent"))), 4)
        self.assertEqual(len(list(self.tools.glob("*.partial"))), 4)

    def test_cleanup_snapshot_and_lease_creation_share_mutation_lock(self):
        files = dict(self.package["files"])
        files["release.py"] = base64.b64encode(
            base64.b64decode(files["release.py"]) + b"\n# old fixture\n"
        ).decode()
        old = {"files": files, "sha256": digest(canonical(files))}
        target = self.tools / old["sha256"]
        for name, encoded in files.items():
            path = target / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(base64.b64decode(encoded))
        durable_json(target / "helper.json", old)
        expired = time.time() - 86402
        os.utime(target, (expired, expired))
        original = Path.iterdir
        blocked = []

        def interleave(path):
            if path == self.tools and not blocked:
                with (self.tools.parent / "lock").open("a") as stream:
                    try:
                        fcntl.flock(stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
                    except BlockingIOError:
                        blocked.append(True)
                    else:
                        blocked.append(False)
                        durable_json(
                            self.tools.parent / "lease.json", {"helper": old["sha256"]}
                        )
            return original(path)

        with patch("pathlib.Path.iterdir", interleave):
            self.install()
        self.assertEqual(blocked, [True])
        self.assertFalse((self.tools.parent / "lease.json").exists())
        self.assertFalse(target.exists())


if __name__ == "__main__":
    unittest.main()
