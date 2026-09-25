"""Isolated real bounded wrappers, unprivileged HTTP, recovery and continuous observations."""

import fcntl
import json
import os
import select
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

from support import CSP, SOURCE, fixture, representative_tree
from resource_monitor import ProcessMemory
from release_bootstrap import bootstrap_source
from release_bundle import helper_package
from release_engine.artifact import pack
from release_engine.origin import check_origin
from release_engine.protocol import ReleaseError, canonical, load_json
from release_engine.system import (
    INODE_ENVELOPE,
    PEAK_DISK,
    PROCESS_MEMORY_BUDGET,
    unit_name,
)
from release_process import run
from release_transport import HostClient, bounded_unit


class LocalClient(HostClient):
    def _invoke(self, command, *, data=None, stream=None, timeout=45):
        result = run(
            command,
            input=data if stream is None else None,
            stdin=stream,
            timeout=timeout,
        )
        if result.returncode not in (0, 2) or not result.stdout:
            raise ReleaseError(
                f"isolated bounded wrapper failed ({result.returncode}): {result.stderr.decode()[:700]}"
            )
        return json.loads(result.stdout)


@unittest.skipUnless(
    os.environ.get("RELEASE_SYSTEMD_TESTS") == "1", "requires isolated systemd runner"
)
class IntegrationSystemdTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if sys.platform != "linux" or os.geteuid() != 0:
            raise RuntimeError(
                "integration evidence requires isolated Linux root/systemd"
            )

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-systemd-integration-")
        self.base = Path(self.temp.name)
        self.base.chmod(0o755)
        self.engine = fixture(self.base)
        shutil.rmtree(self.engine.html)
        representative_tree(self.engine.html, "one")
        self.prefix = unit_name(self.engine.root, "", "guard").rsplit("-", 2)[0] + "-"
        self.helpers = helper_package()
        self.client = LocalClient(
            "fixture.invalid",
            "root",
            "/fixture/key",
            "/fixture/known",
            str(self.engine.html),
            self.helpers,
        )
        self.policy = {
            "csp": "default-src 'self'; script-src 'self' "
            + " ".join("'" + h + "'" for h in CSP)
            + "; frame-ancestors 'self';",
            "script_hashes": sorted(CSP),
        }
        policy = self.base / "policy.json"
        policy.write_bytes(canonical(self.policy))
        self.server = subprocess.Popen(
            [
                sys.executable,
                "-B",
                "scripts/release_preview.py",
                "--root",
                str(self.engine.html),
                "--policy",
                str(policy),
                "--port",
                "0",
                "--uid",
                "65534",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        self.addCleanup(self.clean)
        self.assertTrue(select.select([self.server.stdout], [], [], 5)[0])
        self.origin = "http://127.0.0.1:" + str(
            json.loads(self.server.stdout.readline())["port"]
        )

    def clean(self):
        units = subprocess.run(
            [
                "systemctl",
                "list-units",
                "--all",
                "--plain",
                "--no-legend",
                self.prefix + "*",
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )
        for line in units.stdout.splitlines():
            unit = line.split()[0]
            if unit.startswith(self.prefix):
                subprocess.run(
                    ["systemctl", "stop", unit], capture_output=True, timeout=10
                )
        self.server.terminate()
        try:
            self.server.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            self.server.kill()
            self.server.communicate(timeout=5)
        self.temp.cleanup()

    def bundle(self, number):
        source = self.base / f"source-{number}"
        representative_tree(source, f"v{number}")
        archive = self.base / f"{number}.tar.gz"
        manifest = self.base / f"{number}.json"
        identity = pack(source, archive, manifest, SOURCE, number, 1)
        envelope = load_json(manifest)
        lease = self.client.call(
            "begin",
            request={
                "manifest": envelope,
                "policy": self.policy,
                "origin": self.origin,
                "mode": "deploy",
            },
        )
        self.client.call("receive", lease=lease, archive=archive)
        self.client.call("prepare", lease=lease, request={"fresh_master": SOURCE})
        return lease, identity, envelope

    def assert_http(self, identity, envelope):
        result = check_origin(
            self.origin,
            identity,
            envelope["payload"]["files"],
            self.policy,
            time.monotonic() + 10,
        )
        self.assertTrue(result["origin"])

    def test_real_wrapper_roundtrips_retry_retention_and_continuous_peak(self):
        # This HTTP fixture represents already-resident Nginx, not a new release process.
        with ProcessMemory(
            self.engine.root,
            self.prefix,
            allocation_root=self.engine.root,
            exclude_pids={self.server.pid},
        ) as monitor:
            self.client.install()
            first_asset = None
            for number in range(1, 6):
                lease, identity, envelope = self.bundle(number)
                self.client.call(
                    "activate", lease=lease, request={"fresh_master": SOURCE}
                )
                self.assert_http(identity, envelope)
                self.client.call(
                    "accept",
                    lease=lease,
                    request={"identity": identity, "origin": True, "browser": True},
                )
                if first_asset is None:
                    first_asset = next(
                        path
                        for path in envelope["payload"]["files"]
                        if path.endswith(".js") and path.startswith("_astro/")
                    )
                self.assertTrue((self.engine.html / first_asset).is_file())
                self.client.call("cleanup", lease=lease)
                self.client.call("finish", lease=lease)
                self.assertEqual(list((self.engine.private / "incoming").iterdir()), [])
            retry = self.client.call(
                "begin",
                request={
                    "manifest": envelope,
                    "policy": self.policy,
                    "origin": self.origin,
                    "mode": "publish",
                },
            )
            before = self.engine.status()["serving"]
            self.assert_http(identity, envelope)
            self.client.call("finish", lease=retry)
            self.assertEqual(self.engine.status()["serving"], before)
            lease, failed_identity, _ = self.bundle(6)
            self.client.call("activate", lease=lease, request={"fresh_master": SOURCE})
            recovered = self.client.call("recover", lease=lease)
            self.assertTrue(recovered["last"]["origin_verified"])
            self.assertEqual(recovered["last"]["outcome"], "failed")
            self.assert_http(identity, envelope)
            self.client.call("cleanup", lease=lease)
            self.client.call("finish", lease=lease)
            self.assertTrue((self.engine.html / first_asset).is_file())
        peak = max(monitor.samples)
        disk = max(size for size, _ in monitor.allocations)
        inodes = max(count for _, count in monitor.allocations)
        self.assertGreater(peak, 0)
        self.assertLess(peak, PROCESS_MEMORY_BUDGET)
        self.assertLess(disk, PEAK_DISK)
        self.assertLess(inodes, INODE_ENVELOPE)
        self.assertGreater(len(monitor.allocations), 10)
        print(
            f"INTEGRATION_RESOURCE sampled_combined_rss={peak} continuous_sampled_allocated_peak={disk} inode_peak={inodes} samples={len(monitor.allocations)} polling_seconds=0.02 fixture_http_pid_excluded=true",
            flush=True,
        )

    def test_abandoned_guard_restores_and_verifies_real_http_at_original_deadline(self):
        self.client.install()
        lease, identity, envelope = self.bundle(1)
        initial = self.engine.status()["pending"]["prior"]
        started = time.monotonic()
        self.client.call("activate", lease=lease, request={"fresh_master": SOURCE})
        self.assert_http(identity, envelope)
        until = started + 241
        while self.engine.status()["pending"] is not None:
            self.assertLess(time.monotonic(), until)
            time.sleep(0.2)
        state = self.engine.status()
        self.assertEqual(state["last"]["outcome"], "failed")
        self.assertTrue(state["last"]["origin_verified"])
        record = self.engine._view(initial)
        check_origin(
            self.origin,
            record["identity"],
            record["files"],
            self.policy,
            time.monotonic() + 10,
        )
        elapsed = time.monotonic() - started
        self.assertGreaterEqual(elapsed, 179)
        self.assertLess(elapsed, 241)
        print(
            f"INTEGRATION_RECOVERY abandoned_guard_http_verified_seconds={elapsed:.3f}",
            flush=True,
        )

    def test_stopped_bootstrap_and_upload_lock_owners_are_hard_bounded(self):
        root = str(self.engine.root)
        commands = [
            (
                "bootstrap",
                bounded_unit(
                    root,
                    "bootstrap-stall",
                    [
                        sys.executable,
                        "-B",
                        "-c",
                        bootstrap_source(),
                        root,
                        self.helpers["sha256"],
                    ],
                    20,
                ),
                self.engine.private / "bootstrap.lock",
                20,
            )
        ]
        self.client.install()
        source = self.base / "upload-source"
        representative_tree(source, "upload")
        manifest = self.base / "upload.json"
        archive = self.base / "upload.tar.gz"
        identity = pack(source, archive, manifest, SOURCE, 7, 1)
        lease = self.client.call(
            "begin",
            request={
                "manifest": load_json(manifest),
                "policy": self.policy,
                "origin": self.origin,
                "mode": "deploy",
            },
        )
        entry = (
            self.engine.private / "tools" / self.helpers["sha256"] / "release_host.py"
        )
        commands.append(
            (
                "upload",
                bounded_unit(
                    root,
                    identity["build_id"],
                    [
                        sys.executable,
                        "-B",
                        str(entry),
                        "receive",
                        "--root",
                        root,
                        "--generation",
                        lease["id"],
                        "--token",
                        lease["token"],
                    ],
                    110,
                ),
                self.engine.private / "upload.lock",
                110,
            )
        )
        for label, command, lock, budget in commands:
            process = subprocess.Popen(
                command,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            unit = next(
                arg.split("=", 1)[1] for arg in command if arg.startswith("--unit=")
            )
            started = time.monotonic()
            try:
                until = started + 8
                while True:
                    held = False
                    if lock.exists():
                        with lock.open("a") as stream:
                            try:
                                fcntl.flock(stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
                            except BlockingIOError:
                                held = True
                    if held:
                        break
                    self.assertLess(
                        time.monotonic(), until, f"{label} never owned its lock"
                    )
                    time.sleep(0.02)
                pid = int(
                    subprocess.run(
                        ["systemctl", "show", "--property=MainPID", "--value", unit],
                        check=True,
                        capture_output=True,
                        text=True,
                        timeout=5,
                    ).stdout
                )
                self.assertGreater(pid, 1)
                os.kill(pid, signal.SIGSTOP)
                process.wait(timeout=budget + 8)
                self.assertNotEqual(process.returncode, 0)
                with lock.open("a") as stream:
                    fcntl.flock(stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
                elapsed = time.monotonic() - started
                self.assertLess(elapsed, budget + 8)
                print(
                    f"INTEGRATION_LOCK {label}_stopped_owner_collected_seconds={elapsed:.3f} hard_runtime={budget}",
                    flush=True,
                )
            finally:
                subprocess.run(
                    ["systemctl", "stop", unit], capture_output=True, timeout=10
                )
                process.communicate(timeout=5)
