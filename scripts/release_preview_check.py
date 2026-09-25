"""Check the verified immutable preview, then collect only the fixture process we started."""

import argparse
import json
import select
import subprocess
import sys
import time
from pathlib import Path

from release_acceptance import accept
from release_engine.protocol import require


def check(bundle, preview):
    process = subprocess.Popen(
        [
            sys.executable,
            "-B",
            "scripts/release_preview.py",
            "--root",
            str(preview.resolve()),
            "--policy",
            str((bundle / "policy.json").resolve()),
            "--port",
            "0",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    try:
        require(
            select.select([process.stdout], [], [], 5)[0],
            "artifact preview did not start",
        )
        port = json.loads(process.stdout.readline())["port"]
        require(type(port) is int and 0 < port < 65536, "invalid preview listener")
        return accept(f"http://127.0.0.1:{port}", bundle, time.monotonic() + 120)
    finally:
        process.terminate()
        try:
            process.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.communicate(timeout=5)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--preview", type=Path, required=True)
    args = parser.parse_args()
    check(args.bundle, args.preview)
