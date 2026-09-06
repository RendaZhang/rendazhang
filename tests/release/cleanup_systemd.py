"""Always-step cleanup, restricted to this suite's disposable fixture roots and units."""

import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from release_engine.system import unit_name


def main():
    for root in Path("/tmp").glob("release-systemd-*/host"):
        if root.is_symlink() or not root.is_dir() or root.stat().st_uid != 0:
            raise RuntimeError("unexpected fixture ownership")
        prefix = unit_name(root, "", "guard").rsplit("-", 2)[0] + "-"
        result = subprocess.run(
            [
                "systemctl",
                "list-units",
                "--all",
                "--plain",
                "--no-legend",
                prefix + "*.service",
            ],
            capture_output=True,
            text=True,
            timeout=10,
            check=True,
        )
        for line in result.stdout.splitlines():
            unit = line.split()[0]
            if not unit.startswith(prefix) or not unit.endswith(".service"):
                raise RuntimeError("unexpected fixture service")
            subprocess.run(["systemctl", "stop", unit], check=True, timeout=10)
            active = subprocess.run(
                ["systemctl", "is-active", unit], capture_output=True, timeout=5
            )
            if active.stdout.strip() == b"active":
                raise RuntimeError("fixture service remained active")
        shutil.rmtree(root.parent)


if __name__ == "__main__":
    main()
