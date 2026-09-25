import tempfile
import time
import unittest
from pathlib import Path

from support import artifact
from release_engine.protocol import ReleaseError
from release_engine.system import durable_json
from release_runner import transact


class Client:
    def __init__(self, identity):
        self.identity = identity
        self.calls = []
        self.lease = None
        self.state = {
            "pending": None,
            "accepted": None,
            "serving": "bootstrap",
            "last": None,
        }
        self.lost_ack = False

    def install(self):
        self.calls.append("install")

    def call(self, action, **kwargs):
        self.calls.append(action)
        identity = self.identity
        if action == "status":
            return {
                "state": dict(self.state),
                "lease": self.lease,
                "server_time": time.time(),
            }
        if action == "begin":
            self.lease = {
                "id": identity["build_id"],
                "token": "owned",
                "helper": "a" * 64,
                "expires": time.time() + 600,
                "mode": kwargs["request"]["mode"],
            }
            return self.lease
        if action == "prepare":
            self.state["pending"] = {"id": identity["build_id"]}
        if action == "activate":
            self.state["serving"] = identity["build_id"]
        if action == "accept":
            if kwargs["request"] != {
                "identity": identity,
                "origin": True,
                "browser": True,
            }:
                raise ReleaseError("bad acceptance")
            self.state.update(
                accepted=identity["build_id"],
                pending=None,
                last={"id": identity["build_id"], "outcome": "accepted"},
            )
            if self.lost_ack:
                raise ReleaseError("lost acknowledgement")
        if action in ("recover", "reconcile"):
            self.state.update(
                pending=None,
                serving="bootstrap",
                last={"id": identity["build_id"], "outcome": "failed"},
            )
        if action == "finish":
            self.lease = None
        return dict(self.state)


class RunnerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-runner-")
        self.addCleanup(self.temp.cleanup)
        self.bundle = Path(self.temp.name)
        _, manifest, self.identity = artifact(self.bundle)
        durable_json(self.bundle / "manifest.json", manifest)
        durable_json(self.bundle / "identity.json", self.identity)
        durable_json(self.bundle / "policy.json", {"fixture": True})
        self.client = Client(self.identity)
        self.master_reads = []

    def master(self):
        self.master_reads.append(len(self.client.calls))
        return self.identity["source_sha"]

    def browser(self, origin, bundle, deadline):
        self.client.calls.append("browser")
        self.assertEqual(origin, "https://example.test")
        self.assertGreater(deadline, time.monotonic())
        return {"identity": self.identity, "origin": True, "browser": True}

    def execute(self, publish=None, browser=None, mode="deploy"):
        return transact(
            self.client,
            self.bundle,
            "https://example.test",
            self.master,
            publish or (lambda guard: guard()),
            browser=browser or self.browser,
            mode=mode,
        )

    def test_origin_ordering_and_fresh_master_immediately_before_activation(self):
        self.assertTrue(self.execute()["distribution_complete"])
        calls = [call for call in self.client.calls if call != "status"]
        self.assertEqual(
            calls,
            [
                "install",
                "begin",
                "receive",
                "prepare",
                "activate",
                "browser",
                "accept",
                "cleanup",
                "finish",
            ],
        )
        self.assertEqual(self.master_reads[-1], self.client.calls.index("activate"))
        self.assertEqual(len(self.master_reads), 3)

    def test_failed_browser_recovers_and_never_publishes(self):
        def fail(*_args):
            raise ReleaseError("browser failure")

        with self.assertRaisesRegex(ReleaseError, "browser failure"):
            self.execute(
                publish=lambda _guard: self.fail("must not publish"), browser=fail
            )
        self.assertIn("recover", self.client.calls)
        self.assertNotIn("accept", self.client.calls)
        self.assertEqual(self.client.state["last"]["outcome"], "failed")

    def test_mirror_failure_keeps_accepted_origin_and_exact_retry_never_activates(self):
        def fail(guard):
            guard()
            raise ReleaseError("distribution failure")

        with self.assertRaisesRegex(ReleaseError, "distribution failure"):
            self.execute(publish=fail)
        self.assertNotIn("recover", self.client.calls)
        self.assertEqual(self.client.state["last"]["outcome"], "accepted")
        self.client.calls.clear()
        self.execute(mode="publish")
        self.assertNotIn("prepare", self.client.calls)
        self.assertNotIn("receive", self.client.calls)
        self.assertNotIn("activate", self.client.calls)
        self.assertNotIn("accept", self.client.calls)

    def test_lost_ack_does_not_rollback_committed_acceptance(self):
        self.client.lost_ack = True
        with self.assertRaisesRegex(ReleaseError, "lost acknowledgement"):
            self.execute()
        self.assertNotIn("recover", self.client.calls)
        self.assertEqual(self.client.state["last"]["outcome"], "accepted")

    def test_expired_pending_is_reconciled_with_original_helper_then_stops(self):
        self.client.lease = {
            "id": self.identity["build_id"],
            "token": "owned",
            "helper": "a" * 64,
            "expires": time.time() - 1,
        }
        self.client.state["pending"] = {"id": self.identity["build_id"]}
        with self.assertRaisesRegex(ReleaseError, "original failed outcome"):
            self.execute()
        self.assertIn("reconcile", self.client.calls)
        self.assertNotIn("begin", self.client.calls)

    def test_newer_origin_or_expired_publication_lease_cannot_publish(self):
        for mutation in (
            lambda: self.client.state.update(serving="newer"),
            lambda: self.client.lease.update(expires=time.time() - 1),
        ):
            self.client = Client(self.identity)

            def stale(guard):
                mutation()
                guard()
                self.fail("must not publish stale origin")

            with self.assertRaisesRegex(ReleaseError, "publication lease/origin"):
                self.execute(publish=stale)
            self.assertNotIn("recover", self.client.calls)


if __name__ == "__main__":
    unittest.main()
