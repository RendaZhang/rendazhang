"""Sample fixture-owned CLI/service/client RSS; monitor failures fail the caller."""

import subprocess
import threading
from pathlib import Path


class ProcessMemory:
    def __init__(self, root, unit_prefix, *, allocation_root=None, exclude_pids=()):
        self.root = str(root)
        self.prefix = unit_prefix
        self.samples = []
        self.errors = []
        self.stop = threading.Event()
        self.allocation_root = Path(allocation_root) if allocation_root else None
        self.allocations = []
        self.exclude_pids = set(exclude_pids)

    def observe(self):
        try:
            while not self.stop.is_set():
                result = subprocess.run(
                    ["ps", "-eo", "pid=,rss=,args="],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    check=True,
                )
                total = 0
                for line in result.stdout.splitlines():
                    fields = line.split(None, 2)
                    if (
                        len(fields) == 3
                        and int(fields[0]) not in self.exclude_pids
                        and (self.root in fields[2] or self.prefix in fields[2])
                    ):
                        total += int(fields[1]) * 1024
                self.samples.append(total)
                if self.allocation_root:
                    size = inodes = 0
                    for path in self.allocation_root.rglob("*"):
                        try:
                            stat = path.lstat()
                        except FileNotFoundError:
                            continue
                        size += stat.st_blocks * 512
                        inodes += 1
                    self.allocations.append((size, inodes))
                self.stop.wait(0.02)
        except BaseException as exc:
            self.errors.append(exc)

    def __enter__(self):
        self.thread = threading.Thread(target=self.observe, daemon=True)
        self.thread.start()
        return self

    def __exit__(self, *_exc):
        self.stop.set()
        self.thread.join(timeout=10)
        if self.thread.is_alive() or self.errors or not self.samples:
            raise RuntimeError("process memory monitor failed") from (
                self.errors[0] if self.errors else None
            )
