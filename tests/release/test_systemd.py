"""Opt-in real systemd tests, required (not mocked/skipped) in the isolated Linux workflow."""

import os
import json
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

from support import (
    CSP,
    SOURCE,
    accept,
    activate,
    artifact,
    fixture,
    prepare,
    representative_tree,
)
from resource_monitor import ProcessMemory
from release_engine.artifact import pack, load_json, MIB
from release_engine.engine import Engine
from release_engine.system import ENTRY, unit_name


@unittest.skipUnless(
    os.environ.get("RELEASE_SYSTEMD_TESTS") == "1", "requires isolated systemd runner"
)
class RealSystemdTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if sys.platform != "linux" or os.geteuid() != 0:
            raise RuntimeError(
                "real systemd gate requires the isolated Linux runner with sudo"
            )
        subprocess.run(
            ["systemctl", "show", "--property=Version"],
            check=True,
            capture_output=True,
            timeout=5,
        )

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-systemd-")
        self.base = Path(self.temp.name)
        self.engine = fixture(self.base)
        self.archive, self.envelope, self.identity = artifact(self.base)
        self.generation = self.identity["build_id"]
        self.generations = {self.generation, "maintenance"}
        self.addCleanup(self.clean)

    def clean(self):
        for generation in self.generations:
            for role in ("worker", "guard"):
                unit = unit_name(self.engine.root, generation, role)
                subprocess.run(
                    ["systemctl", "stop", unit], capture_output=True, timeout=10
                )
                subprocess.run(
                    ["systemctl", "reset-failed", unit], capture_output=True, timeout=5
                )
                active = subprocess.run(
                    ["systemctl", "is-active", unit], capture_output=True, timeout=5
                )
                self.assertNotEqual(active.stdout.strip(), b"active")
        self.temp.cleanup()

    def test_real_cli_supervisor_worker_guard_combined_budget_and_acceptance(self):
        shutil.rmtree(self.engine.html)
        representative_tree(self.engine.html, "one")
        self.engine = Engine(self.engine.root)
        policy = self.base / "policy.json"
        policy.write_text(json.dumps({"script_hashes": sorted(CSP)}))
        peaks = []

        def cli(action, *arguments, expected_code=0):
            prefix = unit_name(self.engine.root, "", "guard").rsplit("-", 2)[0] + "-"
            with ProcessMemory(self.engine.root, prefix) as monitor:
                result = subprocess.run(
                    [
                        sys.executable,
                        "-B",
                        str(ENTRY),
                        action,
                        "--root",
                        str(self.engine.root),
                        *map(str, arguments),
                    ],
                    capture_output=True,
                    timeout=45,
                )
            self.assertEqual(result.returncode, expected_code, result.stderr.decode())
            peak = max(monitor.samples)
            self.assertGreater(peak, 0, "monitor did not observe release processes")
            self.assertLess(
                peak, 64 * MIB, f"{action} aggregate RSS exceeds budget: {peak}"
            )
            peaks.append(peak)
            allocated = (
                sum(
                    p.lstat().st_blocks * 512
                    for p in self.engine.root.rglob("*")
                    if not p.is_symlink()
                )
                + archive.stat().st_blocks * 512
            )
            self.assertLessEqual(allocated, 832 * MIB)
            print(
                f"RESOURCE phase={action} explicit_target={'--target' in arguments} combined_sampled_peak_bytes={peak} samples={len(monitor.samples)} allocated_after_bytes={allocated}",
                flush=True,
            )
            return json.loads(result.stdout)

        for run, version, outcome in ((2, "two", "accept"), (3, "three", "recover")):
            source = self.base / f"representative-{run}"
            representative_tree(source, version)
            archive = self.base / f"representative-{run}.tar.gz"
            manifest = self.base / f"representative-{run}.json"
            identity = pack(source, archive, manifest, SOURCE, run, 1)
            envelope = load_json(manifest)
            files = envelope["payload"]["files"]
            self.assertEqual(len(files), 166)
            self.assertGreater(sum(e["bytes"] for e in files.values()), 7038158)
            print(
                f"RESOURCE fixture_files={len(files)} base_bytes={sum(e['bytes'] for e in files.values())} archive_bytes={archive.stat().st_size}",
                flush=True,
            )
            generation = identity["build_id"]
            self.generations.add(generation)
            expected = self.engine.status()["serving"]
            cli(
                "prepare",
                "--archive",
                archive,
                "--manifest",
                manifest,
                "--expected",
                expected,
                "--fresh-master",
                SOURCE,
                "--csp",
                policy,
            )
            cli(
                "activate",
                "--generation",
                generation,
                "--expected",
                expected,
                "--fresh-master",
                SOURCE,
            )
            if outcome == "accept":
                evidence = self.base / "acceptance.json"
                evidence.write_text(
                    json.dumps({"identity": identity, "origin": True, "browser": True})
                )
                self.assertEqual(
                    cli("accept", "--generation", generation, "--evidence", evidence)[
                        "last"
                    ]["outcome"],
                    "accepted",
                )
            else:
                recovered = cli("recover", "--generation", generation, expected_code=2)
                self.assertEqual(recovered["last"]["phase"], "recovered")
            cli("cleanup", expected_code=0 if outcome == "accept" else 2)
            if outcome == "accept":
                cli(
                    "recover",
                    "--generation",
                    generation,
                    "--target",
                    self.engine.status()["previous"],
                    expected_code=2,
                )
                cli("cleanup", expected_code=2)
        print(
            f"RESOURCE lifecycle_combined_sampled_peak_bytes={max(peaks)} hard_worker_memorymax_bytes={32 * MIB} hard_guard_memorymax_bytes={32 * MIB} aggregate_sampling_not_hard_limit=true",
            flush=True,
        )

    def test_real_explicit_rollback_guard_survives_journal_caller_death(self):
        prepare(self.engine, self.archive, self.envelope)
        activate(self.engine, self.identity)
        accept(self.engine, self.identity)
        script = Path(__file__).with_name("crash_worker.py").resolve()
        started = time.monotonic()
        subprocess.run(
            [
                "systemd-run",
                "--quiet",
                "--collect",
                f"--unit={unit_name(self.engine.root, self.generation, 'worker')}",
                "--service-type=exec",
                "--property=RuntimeMaxSec=30",
                "--property=TimeoutStopSec=2",
                "--property=MemoryMax=32M",
                "--property=KillMode=control-group",
                sys.executable,
                "-B",
                str(script),
                str(self.engine.root),
                "explicit_death",
                "explicit",
            ],
            check=True,
            timeout=10,
        )
        saw_guard = False
        saw_journal = False
        while time.monotonic() - started < 60:
            state = self.engine.status()
            if state["pending"]:
                saw_journal |= state["pending"]["phase"] == "recovering" and state[
                    "pending"
                ].get("explicit", False)
                active = subprocess.run(
                    [
                        "systemctl",
                        "is-active",
                        unit_name(self.engine.root, self.generation, "guard"),
                    ],
                    capture_output=True,
                    timeout=5,
                )
                saw_guard |= active.stdout.strip() == b"active"
            elif state["last"]["outcome"] == "failed":
                break
            time.sleep(0.1)
        else:
            self.fail("explicit rollback did not recover within 60 seconds")
        self.assertTrue(saw_guard and saw_journal)
        self.assertIn(b"one", (self.engine.html / "index.html").read_bytes())
        self.assertTrue((self.engine.html / "_astro/main.two12345678.js").exists())
        elapsed = time.monotonic() - started
        self.assertGreaterEqual(elapsed, 25)
        print(
            f"RECOVERY fault=explicit_journal_caller_death elapsed_seconds={elapsed:.3f} guard_survived=true exposed_assets=retained",
            flush=True,
        )

    def exercise_abandoned(self, fault):
        prepare(self.engine, self.archive, self.envelope)
        unit = unit_name(self.engine.root, self.generation, "worker")
        started = time.monotonic()
        script = Path(__file__).with_name("crash_worker.py").resolve()
        subprocess.run(
            [
                "systemd-run",
                "--quiet",
                "--collect",
                f"--unit={unit}",
                "--service-type=exec",
                "--property=RuntimeMaxSec=30",
                "--property=TimeoutStopSec=2",
                "--property=MemoryMax=32M",
                "--property=KillMode=control-group",
                sys.executable,
                "-B",
                str(script),
                str(self.engine.root),
                fault,
                "activate",
            ],
            check=True,
            timeout=10,
        )
        saw_guard = False
        saw_candidate = False
        worker_gone = False
        competing_started = False
        while time.monotonic() - started < 240:
            if (
                fault == "death"
                and not competing_started
                and time.monotonic() - started > 175
            ):
                competing_started = True
                maintenance = unit_name(self.engine.root, "maintenance", "worker")
                subprocess.run(
                    [
                        "systemd-run",
                        "--quiet",
                        "--collect",
                        f"--unit={maintenance}",
                        "--service-type=exec",
                        "--property=RuntimeMaxSec=30",
                        "--property=TimeoutStopSec=2",
                        "--property=MemoryMax=32M",
                        "--property=KillMode=control-group",
                        sys.executable,
                        "-B",
                        str(script),
                        str(self.engine.root),
                        "none",
                        "hold",
                    ],
                    check=True,
                    timeout=10,
                )
            status = self.engine.status()
            saw_candidate |= status["serving"] == self.generation
            guard = subprocess.run(
                [
                    "systemctl",
                    "is-active",
                    unit_name(self.engine.root, self.generation, "guard"),
                ],
                capture_output=True,
                timeout=5,
            )
            saw_guard |= guard.stdout.strip() == b"active"
            if time.monotonic() - started > 40:
                result = subprocess.run(
                    ["systemctl", "is-active", unit], capture_output=True, timeout=5
                )
                worker_gone |= result.stdout.strip() != b"active"
                self.assertTrue(worker_gone, "hung worker was not bounded by systemd")
            if status["pending"] is None:
                self.assertEqual(status["last"]["outcome"], "failed")
                self.assertEqual(status["last"]["phase"], "recovered")
                break
            time.sleep(0.5)
        else:
            self.fail("real guard did not recover within 240 seconds")
        self.assertTrue(saw_guard and saw_candidate and worker_gone)
        self.assertIn(b"one", (self.engine.html / "index.html").read_bytes())
        elapsed = time.monotonic() - started
        self.assertGreaterEqual(
            elapsed, 175, "production 180-second guard was bypassed"
        )
        if fault == "death":
            self.assertTrue(competing_started)
            self.assertGreater(elapsed, 195, "maintenance contention was not exercised")
        print(
            f"RECOVERY fault={fault} elapsed_seconds={elapsed:.3f} parent_gone=true guard_survived=true competing_lock={competing_started}",
            flush=True,
        )

    def test_real_guard_survives_parent_kill(self):
        self.exercise_abandoned("death")

    def test_real_guard_survives_sigstop_and_releases_hung_lock(self):
        self.exercise_abandoned("hang")


if __name__ == "__main__":
    unittest.main()
