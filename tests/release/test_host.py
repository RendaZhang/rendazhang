import tempfile
import fcntl
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from support import CSP, SOURCE, artifact, fixture, prepare
from release_engine.protocol import ReleaseError
from release_engine.system import durable_json
from release_host import begin, finish

HELPER = "f" * 64


class HostTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-host-")
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.engine = fixture(self.base)
        self.helper_check = patch(
            "release_host.verify_installed", return_value=HELPER
        ).start()
        self.addCleanup(patch.stopall)
        self.archive, self.manifest, self.identity = artifact(self.base)
        self.request = {
            "manifest": self.manifest,
            "policy": {"csp": "default-src 'self'", "script_hashes": sorted(CSP)},
            "origin": "http://127.0.0.1:4322",
            "mode": "deploy",
        }

    def own(self, lease):
        self.engine.ownership = {
            "id": lease["id"],
            "token": lease["token"],
            "helper": HELPER,
        }
        return self.engine.ownership

    def mark_accepted(self):
        # Portable lifecycle fixture: actual pointer exchanges remain in Linux tests.
        state = self.engine._load()
        state.update(accepted=self.identity["build_id"], last={"outcome": "accepted"})
        durable_json(self.engine.state_path, state)
        durable_json(
            self.engine._metadata(self.identity["build_id"]),
            {"view": self.identity["build_id"], "identity": self.identity},
        )

    def test_same_artifact_publication_retry_has_separate_operation_mode(self):
        lease = begin(self.engine, HELPER, self.request)
        self.mark_accepted()
        old_ticket = (
            self.engine.private / "incoming" / lease["id"] / "ticket.json"
        ).read_bytes()
        self.engine.clock = lambda: lease["expires"] + 1
        retry = begin(self.engine, HELPER, dict(self.request, mode="publish"))
        self.assertEqual(
            old_ticket,
            (
                self.engine.private / "incoming" / lease["id"] / "ticket.json"
            ).read_bytes(),
        )
        finish(self.engine, self.own(retry))
        again = begin(self.engine, HELPER, dict(self.request, mode="publish"))
        self.own(again)
        self.assertEqual(again["id"], lease["id"])
        with self.assertRaisesRegex(ReleaseError, "mirror retry"):
            self.engine._owned(again["id"], "activate")

    def test_finish_reclaims_owned_inputs_without_retained_asset_cleanup(self):
        unreferenced = self.engine.private / "incoming" / "failed-unreferenced"
        unreferenced.mkdir(parents=True)
        retained = self.engine.views / "retained-proof"
        retained.mkdir()
        for run in range(1, 6):
            if run > 1:
                _, manifest, _ = artifact(self.base, run=run)
            else:
                manifest = self.manifest
            lease = begin(self.engine, HELPER, dict(self.request, manifest=manifest))
            finish(self.engine, self.own(lease))
            self.assertEqual(
                list((self.engine.private / "incoming").iterdir()), [unreferenced]
            )
            self.assertTrue(retained.exists())

    def test_old_owned_orphans_and_http_metadata_expire_before_quota_blocks_begin(self):
        for number in range(1, 4):
            manifest = (
                self.manifest if number == 1 else artifact(self.base, run=number)[1]
            )
            begin(self.engine, HELPER, dict(self.request, manifest=manifest))
            # Fixture death before acknowledgement leaves owned transfer metadata only.
            (self.engine.private / "lease.json").unlink()
        request = dict(self.request, manifest=artifact(self.base, run=4)[1])
        with self.assertRaisesRegex(ReleaseError, "quota"):
            begin(self.engine, HELPER, request)
        unknown = self.engine.private / "incoming" / "unowned-note"
        unknown.write_text("unowned fixture")
        self.engine.clock = lambda: time.time() + 86401
        lease = begin(self.engine, HELPER, request)
        finish(self.engine, self.own(lease))
        self.assertEqual(list((self.engine.private / "incoming").iterdir()), [unknown])
        self.assertEqual(len(list(self.engine.private.glob("*.http.json"))), 1)

    def test_expired_prepared_generation_can_reconcile_but_not_activate(self):
        lease = begin(self.engine, HELPER, self.request)
        self.own(lease)
        prepare(self.engine, self.archive, self.manifest)
        self.engine.clock = lambda: lease["expires"] + 1
        with self.assertRaisesRegex(ReleaseError, "expired"):
            self.engine.activate(
                lease["id"], expected=lease["expected"], fresh_master=SOURCE
            )
        with self.assertRaisesRegex(ReleaseError, "unresolved"):
            begin(self.engine, HELPER, self.request)
        self.engine.ownership["reconcile"] = True
        with patch("release_engine.origin.check_origin", return_value={"origin": True}):
            result = self.engine.recover(lease["id"])
        self.assertIsNone(result["pending"])
        self.assertEqual(result["last"]["outcome"], "failed")
        self.assertTrue(result["last"]["origin_verified"])
        finish(self.engine, self.engine.ownership)

    def test_stale_actor_rechecked_at_mutation_and_finish(self):
        old = begin(self.engine, HELPER, self.request)
        self.own(old)
        self.engine.clock = lambda: old["expires"] + 1
        new = begin(self.engine, HELPER, self.request)
        for operation in (
            lambda: prepare(self.engine, self.archive, self.manifest),
            lambda: finish(self.engine, self.engine.ownership),
            lambda: self.engine.recover(old["id"]),
        ):
            with self.assertRaisesRegex(ReleaseError, "stale"):
                operation()
        self.assertNotEqual(old["token"], new["token"])
        self.assertFalse(self.engine.html.is_symlink())

    def test_begin_revalidates_helper_under_same_lock_as_cleanup(self):
        def removed(*_args):
            with self.engine.lock_path.open("a") as lock:
                with self.assertRaises(BlockingIOError):
                    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            raise ReleaseError("helper removed before lease")

        self.helper_check.side_effect = removed
        with self.assertRaisesRegex(ReleaseError, "helper removed"):
            begin(self.engine, HELPER, self.request)
        self.assertIsNone(self.engine.status()["pending"])
        self.assertFalse((self.engine.private / "lease.json").exists())

    def test_finish_retains_helper_reference_until_guard_collection_is_proven(self):
        lease = begin(self.engine, HELPER, self.request)
        self.own(lease)
        with patch.object(
            self.engine.guard,
            "assert_collected",
            side_effect=ReleaseError("guard still owns helper"),
        ), self.assertRaisesRegex(ReleaseError, "guard still owns"):
            finish(self.engine, self.engine.ownership)
        self.assertTrue((self.engine.private / "lease.json").exists())

    def test_recovery_http_failure_remains_unresolved(self):
        lease = begin(self.engine, HELPER, self.request)
        self.own(lease)
        prepare(self.engine, self.archive, self.manifest)
        with patch(
            "release_engine.origin.check_origin",
            side_effect=ReleaseError("HTTP fixture unavailable"),
        ), self.assertRaises(ReleaseError):
            self.engine.recover(lease["id"])
        deadline = self.engine.status()["pending"]["http_deadline"]
        with self.assertRaisesRegex(ReleaseError, "unresolved"):
            finish(self.engine, self.engine.ownership)
        with patch("release_engine.origin.check_origin", return_value={"origin": True}):
            self.engine.recover(lease["id"])
        self.assertIsNone(self.engine.status()["pending"])
        self.assertLessEqual(deadline, time.time() + 60)

    def test_later_exact_owner_reverifies_restored_pointer_with_new_bounded_attempt(
        self,
    ):
        from release_engine.system import guard_receipt

        lease = begin(self.engine, HELPER, self.request)
        self.own(lease)
        prepare(self.engine, self.archive, self.manifest)
        with patch(
            "release_engine.origin.check_origin",
            side_effect=ReleaseError("temporary HTTP failure"),
        ), self.assertRaises(ReleaseError):
            self.engine.recover(lease["id"])
        before = self.engine.status()
        old_receipt = guard_receipt(before["pending"])
        deadline = before["pending"]["http_deadline"]
        self.engine.clock = lambda: lease["expires"] + 1
        self.engine.ownership["reconcile"] = True
        with patch(
            "release_engine.origin.check_origin",
            side_effect=ReleaseError("temporary HTTP failure"),
        ), self.assertRaises(ReleaseError):
            self.engine.recover(lease["id"])
        pending = self.engine.status()["pending"]
        self.assertEqual(pending["http_first_deadline"], deadline)
        self.assertGreater(pending["http_deadline"], self.engine.clock())
        self.assertNotEqual(guard_receipt(pending), old_receipt)
        self.assertEqual(self.engine.status()["serving"], before["serving"])
        self.engine.recover(
            lease["id"], cancel_guard=False, expected_receipt=old_receipt
        )
        self.assertIsNotNone(self.engine.status()["pending"])
        with patch(
            "release_engine.origin.check_origin", return_value={"origin": True}
        ) as verify:
            self.engine.recover(lease["id"])
        self.assertEqual(verify.call_count, 1)
        self.assertIsNone(self.engine.status()["pending"])
        self.assertEqual(self.engine.status()["last"]["outcome"], "failed")


if __name__ == "__main__":
    unittest.main()
