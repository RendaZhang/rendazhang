import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

import support  # noqa: F401 - initializes repository script imports without installation.
from release_engine.protocol import ReleaseError
from release_transport import HostClient, bounded_unit, release_parent


class TransportTests(unittest.TestCase):
    def test_lexical_parent_never_traverses_html(self):
        self.assertEqual(release_parent("/srv/site/html"), "/srv/site")
        for path in (
            "/srv/site/html/..",
            "/srv/site/./html",
            "/srv/site/html/",
            "/srv//site/html",
            "relative/html",
            "/html",
            "/srv/site",
        ):
            with self.subTest(path=path), self.assertRaises(ReleaseError):
                release_parent(path)

    def test_all_lock_owners_have_immutable_entry_hard_runtime_and_memory_caps(self):
        client = HostClient(
            "example.test",
            "root",
            Path("/tmp/key"),
            Path("/tmp/known"),
            "/srv/site/html",
            {"sha256": "a" * 64, "files": {}},
        )
        lease = {"id": "1-1-abc", "token": "b" * 32, "helper": "c" * 64}
        with patch.object(client, "_invoke", return_value={}) as invoke:
            for action in (
                "begin",
                "finish",
                "receive",
                "prepare",
                "activate",
                "reconcile",
            ):
                client.call(action, lease=lease)
                command = invoke.call_args.args[0]
                self.assertIn("--property=MemoryMax=32M", command)
                self.assertIn(
                    "--property=RuntimeMaxSec="
                    + ("110" if action == "receive" else "30"),
                    command,
                )
                self.assertIn("--property=TimeoutStopSec=2", command)
                self.assertIn("--property=KillMode=control-group", command)
                self.assertIn(
                    "/srv/site/.release-state/tools/" + "c" * 64 + "/release_host.py",
                    command,
                )
        with patch.object(
            client, "_invoke", return_value={"helper_sha256": "a" * 64}
        ) as invoke:
            client.install()
            self.assertIn("--property=RuntimeMaxSec=20", invoke.call_args.args[0])
        self.assertIn("StrictHostKeyChecking=yes", client.ssh)
        self.assertIn("IdentitiesOnly=yes", client.ssh)

    def test_transport_timeout_requires_reconciliation_not_success(self):
        client = HostClient(
            "example.test",
            "root",
            "/tmp/key",
            "/tmp/known",
            "/srv/site/html",
            {"sha256": "a" * 64},
        )
        with patch(
            "release_transport.run",
            side_effect=subprocess.TimeoutExpired("fixture", 1),
        ), self.assertRaisesRegex(ReleaseError, "reconcile"):
            client.call("status")

    def test_bounded_units_have_distinct_owned_worker_keys(self):
        first = bounded_unit("/srv/site", "one", ["true"], 30)
        second = bounded_unit("/srv/site", "one", ["true"], 30)
        self.assertNotEqual(first, second)
        self.assertEqual(
            first[:5], ["systemd-run", "--quiet", "--wait", "--collect", "--pipe"]
        )


if __name__ == "__main__":
    unittest.main()
