"""Sample fixture-owned CLI/service/client RSS; monitor failures fail the caller."""

import subprocess
import threading


class ProcessMemory:
    def __init__(self, root, unit_prefix):
        self.root = str(root)
        self.prefix = unit_prefix
        self.samples = []
        self.errors = []
        self.stop = threading.Event()

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
                    if len(fields) == 3 and (
                        self.root in fields[2] or self.prefix in fields[2]
                    ):
                        total += int(fields[1]) * 1024
                self.samples.append(total)
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
