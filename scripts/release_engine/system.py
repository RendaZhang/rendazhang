"""Small Linux/filesystem boundary. No production paths or remote connections."""

from __future__ import annotations

import contextlib
import ctypes
import fcntl
import json
import os
import signal
import subprocess
import sys
import time
from pathlib import Path

from .artifact import MIB, ReleaseError, canonical, digest, require

PEAK_DISK = 832 * MIB
DISK_RESERVE = 5 * 1024 * MIB
INODE_ENVELOPE = 30000
INODE_RESERVE = 100000
MEMORY_GATE = 192 * MIB
ACCEPT_SECONDS = 180
LOCK_SECONDS = 15
CRITICAL_SECONDS = 30
RECOVERY_SECONDS = 60
ENTRY = Path(__file__).resolve().parents[1] / "release.py"


def fsync_dir(path: Path) -> None:
    fd = os.open(path, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def durable_json(path: Path, value: dict) -> None:
    data = canonical(value)
    require(len(data) <= 2 * MIB, "private metadata document exceeds budget")
    temporary = path.with_name(path.name + ".next")
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW
    with os.fdopen(os.open(temporary, flags, 0o600), "wb") as stream:
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, path)
    fsync_dir(path.parent)


def sync_tree(root: Path) -> None:
    for directory, _, names in os.walk(root, topdown=False):
        for name in names:
            path = Path(directory) / name
            with path.open("rb") as stream:
                os.fsync(stream.fileno())
        fsync_dir(Path(directory))


def exchange(first: Path, second: Path) -> None:
    require(sys.platform == "linux", "atomic bootstrap requires Linux")
    require(
        first.parent.stat().st_dev == second.parent.stat().st_dev,
        "cross-filesystem exchange",
    )
    libc = ctypes.CDLL(None, use_errno=True)
    require(hasattr(libc, "renameat2"), "renameat2 unavailable")
    rename = libc.renameat2
    rename.argtypes = [
        ctypes.c_int,
        ctypes.c_char_p,
        ctypes.c_int,
        ctypes.c_char_p,
        ctypes.c_uint,
    ]
    rename.restype = ctypes.c_int
    if rename(-100, os.fsencode(first), -100, os.fsencode(second), 2) != 0:
        raise ReleaseError(f"atomic exchange refused (errno {ctypes.get_errno()})")
    fsync_dir(first.parent)
    if first.parent != second.parent:
        fsync_dir(second.parent)


def point(link: Path, target: Path) -> None:
    temporary = link.with_name(link.name + ".next")
    require(link.is_symlink(), "serving pointer is not a symlink")
    if temporary.is_symlink():
        temporary.unlink()
    require(not temporary.exists(), "unexpected temporary pointer")
    temporary.symlink_to(os.path.relpath(target, link.parent), target_is_directory=True)
    fsync_dir(link.parent)
    os.replace(temporary, link)
    fsync_dir(link.parent)


def capacity(root: Path) -> tuple[int, int, int]:
    filesystem = os.statvfs(root)
    available = None
    with Path("/proc/meminfo").open() as stream:
        for line in stream:
            if line.startswith("MemAvailable:"):
                available = int(line.split()[1]) * 1024
                break
    require(available is not None, "physical-memory evidence unavailable")
    return filesystem.f_bavail * filesystem.f_frsize, filesystem.f_favail, available


def admit(values: tuple[int, int, int]) -> None:
    disk, inodes, memory = values
    require(disk >= DISK_RESERVE + PEAK_DISK, "insufficient disk reserve")
    require(inodes >= INODE_RESERVE + INODE_ENVELOPE, "insufficient inode reserve")
    require(memory >= MEMORY_GATE, "insufficient physical memory")


@contextlib.contextmanager
def locked(path: Path, *, deadline: float | None = None):
    fd = os.open(path, os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600)
    acquired = False
    old_handler = signal.getsignal(signal.SIGALRM)

    def expired(_signum, _frame):
        raise ReleaseError("critical section deadline exceeded")

    try:
        lock_deadline = min(time.monotonic() + LOCK_SECONDS, deadline or float("inf"))
        while True:
            try:
                fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
                acquired = True
                break
            except BlockingIOError:
                require(time.monotonic() < lock_deadline, "release lock timed out")
                time.sleep(0.025)
        signal.signal(signal.SIGALRM, expired)
        remaining = min(CRITICAL_SECONDS, (deadline or float("inf")) - time.monotonic())
        require(remaining > 0, "critical section deadline exceeded")
        signal.setitimer(signal.ITIMER_REAL, remaining)
        yield
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        signal.signal(signal.SIGALRM, old_handler)
        if acquired:
            fcntl.flock(fd, fcntl.LOCK_UN)
        os.close(fd)


def unit_name(root: Path, generation: str, role: str) -> str:
    return f"pw-release-{digest(str(root).encode())[:12]}-{digest(generation.encode())[:12]}-{role}.service"


def command(args: list[str], timeout: int = 10) -> str:
    result = subprocess.run(
        args,
        stdin=subprocess.DEVNULL,
        capture_output=True,
        text=True,
        timeout=timeout,
        check=False,
    )
    require(result.returncode == 0, "local systemd operation failed")
    return result.stdout.strip()


class SystemdGuard:
    """Both the watchdog and lock-owning CLI worker are bounded transient services."""

    def arm(self, root: Path, generation: str) -> None:
        name = unit_name(root, generation, "guard")
        ready = root / ".release-state" / f"{generation}.ready"
        active = subprocess.run(
            ["systemctl", "is-active", name], capture_output=True, timeout=5
        )
        if active.returncode == 0 and ready.exists():
            return
        ready.unlink(missing_ok=True)
        command(
            [
                "systemd-run",
                "--quiet",
                "--collect",
                f"--unit={name}",
                "--service-type=exec",
                "--property=MemoryMax=32M",
                "--property=RuntimeMaxSec=245",
                "--property=TimeoutStopSec=2",
                "--property=KillMode=control-group",
                sys.executable,
                "-B",
                str(ENTRY),
                "guard",
                "--root",
                str(root),
                "--generation",
                generation,
            ]
        )
        require(
            command(["systemctl", "is-active", name]) == "active", "guard did not arm"
        )
        deadline = time.monotonic() + 5
        while not ready.exists():
            require(time.monotonic() < deadline, "guard readiness timed out")
            time.sleep(0.025)

    def cancel(self, root: Path, generation: str) -> None:
        name = unit_name(root, generation, "guard")
        subprocess.run(
            ["systemctl", "stop", name], capture_output=True, timeout=10, check=False
        )
        (root / ".release-state" / f"{generation}.ready").unlink(missing_ok=True)

    def kill_worker(self, root: Path, generation: str) -> None:
        # The name is derived from this root/generation, never from a PID supplied by a caller.
        subprocess.run(
            [
                "systemctl",
                "kill",
                "--signal=KILL",
                unit_name(root, generation, "worker"),
            ],
            capture_output=True,
            timeout=5,
            check=False,
        )


def run_worker(root: Path, generation: str, arguments: list[str]) -> dict:
    """CLI mutations cannot leave a SIGSTOP'ed caller holding a lock indefinitely."""
    name = unit_name(root, generation, "worker")
    result = subprocess.run(
        [
            "systemd-run",
            "--quiet",
            "--wait",
            "--collect",
            "--pipe",
            f"--unit={name}",
            "--service-type=exec",
            "--property=MemoryMax=32M",
            "--property=RuntimeMaxSec=30",
            "--property=TimeoutStopSec=2",
            "--property=KillMode=control-group",
            sys.executable,
            "-B",
            str(ENTRY),
            "worker",
            *arguments,
        ],
        stdin=subprocess.DEVNULL,
        capture_output=True,
        text=True,
        timeout=40,
    )
    require(
        result.returncode in (0, 2) and len(result.stdout) <= 2 * MIB,
        "bounded local worker failed",
    )
    try:
        state = json.loads(result.stdout)
    except ValueError as exc:
        raise ReleaseError("bounded local worker returned no valid outcome") from exc
    require(
        isinstance(state, dict) and state.get("schema") == 1, "invalid worker state"
    )
    require(
        result.returncode == 0 or (state.get("last") or {}).get("outcome") == "failed",
        "worker failure has no recorded outcome",
    )
    return state
