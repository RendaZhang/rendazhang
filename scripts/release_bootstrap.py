"""Runner-generated bounded bootstrap for immutable helper installation, not site activation."""

import inspect

from release_engine.system import (
    DISK_RESERVE,
    PEAK_DISK,
    MEMORY_GATE,
    INODE_ENVELOPE,
    INODE_RESERVE,
)

DISK_REQUIRED = DISK_RESERVE + PEAK_DISK
INODES_REQUIRED = INODE_ENVELOPE + INODE_RESERVE
MEMORY_REQUIRED = MEMORY_GATE


def install():
    import base64
    import fcntl
    import hashlib
    import json
    import os
    import re
    import shutil
    import signal
    import sys
    import time
    from pathlib import Path

    signal.alarm(20)

    def require(value):
        if not value:
            raise RuntimeError("immutable helper preflight failed")

    def canonical(value):
        return json.dumps(
            value,
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=True,
            allow_nan=False,
        ).encode()

    def write(path, data):
        with path.open("xb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())

    root = Path(sys.argv[1])
    expected = sys.argv[2]
    require(
        root.is_absolute()
        and str(root) == os.path.normpath(str(root))
        and root.name != "html"
    )
    require(root.resolve(strict=True) == root and root.is_dir())
    require(root.stat().st_uid == os.geteuid() and not root.stat().st_mode & 0o022)
    require(re.fullmatch(r"[0-9a-f]{64}", expected))
    stats = os.statvfs(root)
    memory = next(
        int(line.split()[1]) * 1024
        for line in Path("/proc/meminfo").read_text().splitlines()
        if line.startswith("MemAvailable:")
    )
    require(
        stats.f_bavail * stats.f_frsize >= DISK_REQUIRED
        and stats.f_favail >= INODES_REQUIRED
        and memory >= MEMORY_REQUIRED
    )
    private = root / ".release-state"
    require(not private.is_symlink())
    private.mkdir(mode=0o700, exist_ok=True)
    require(
        private.stat().st_uid == os.geteuid() and not private.stat().st_mode & 0o077
    )
    tools = private / "tools"
    require(not tools.is_symlink())
    tools.mkdir(mode=0o700, exist_ok=True)
    require(tools.stat().st_uid == os.geteuid() and not tools.stat().st_mode & 0o077)
    with (private / "bootstrap.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        raw = sys.stdin.buffer.read(1024 * 1024 + 1)
        require(len(raw) <= 1024 * 1024)
        package = json.loads(raw)
        require(set(package) == {"files", "sha256"} and package["sha256"] == expected)
        require(hashlib.sha256(canonical(package["files"])).hexdigest() == expected)
        files = package["files"]
        require(
            3 <= len(files) <= 24
            and "release.py" in files
            and "release_host.py" in files
        )
        decoded = {}
        for name, data in files.items():
            require(
                name in ("release.py", "release_host.py")
                or re.fullmatch(r"release_engine/[a-z_]+\.py", name)
            )
            decoded[name] = base64.b64decode(data, validate=True)
        with (private / "lock").open("a") as mutation_lock:
            fcntl.flock(mutation_lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            target = tools / expected
            if target.exists():
                require(
                    not target.is_symlink()
                    and json.loads((target / "helper.json").read_bytes()) == package
                )
                require(not any(p.is_symlink() for p in target.rglob("*")))
                require(
                    all(
                        (target / name).read_bytes() == data
                        for name, data in decoded.items()
                    )
                )
            else:
                # Only old unreferenced helper versions expire; no code used by a lease/guard
                # or accepted/previous view is removed or overwritten.
                protected = {expected}
                state_path = private / "state.json"
                state = (
                    json.loads(state_path.read_bytes()) if state_path.exists() else {}
                )
                lease_path = private / "lease.json"
                if lease_path.exists():
                    protected.add(json.loads(lease_path.read_bytes())["helper"])
                if (state.get("pending") or {}).get("http"):
                    protected.add(state["pending"]["http"]["helper"])
                for view in (state.get("accepted"), state.get("previous")):
                    if view:
                        record = json.loads((private / (view + ".json")).read_bytes())
                        contract = private / (
                            record["identity"]["build_id"] + ".http.json"
                        )
                        if contract.exists():
                            protected.add(json.loads(contract.read_bytes())["helper"])
                for candidate in tools.iterdir():
                    if (
                        re.fullmatch(r"[0-9a-f]{64}", candidate.name)
                        and candidate.name not in protected
                        and candidate.stat().st_mtime + 86400 < time.time()
                    ):
                        require(
                            not candidate.is_symlink()
                            and not any(p.is_symlink() for p in candidate.rglob("*"))
                        )
                        record = json.loads((candidate / "helper.json").read_bytes())
                        require(
                            record["sha256"]
                            == candidate.name
                            == hashlib.sha256(canonical(record["files"])).hexdigest()
                        )
                        for directory in (candidate / "release_engine", candidate):
                            directory.chmod(0o700)
                        shutil.rmtree(candidate)
                for old_intent in tools.glob("*.intent"):
                    name = old_intent.name.removesuffix(".intent")
                    if (
                        not re.fullmatch(r"[0-9a-f]{64}", name)
                        or name in protected
                        or old_intent.stat().st_mtime + 86400 >= time.time()
                    ):
                        continue
                    require(
                        not old_intent.is_symlink()
                        and old_intent.read_bytes() == name.encode()
                    )
                    partial = tools / (name + ".partial")
                    require(not partial.is_symlink())
                    if partial.exists():
                        if partial.stat().st_mtime + 86400 >= time.time():
                            continue
                        require(
                            partial.is_dir()
                            and not any(p.is_symlink() for p in partial.rglob("*"))
                        )
                        for path in partial.rglob("*"):
                            relative = path.relative_to(partial).as_posix()
                            require(
                                relative
                                in (
                                    "release_engine",
                                    "release.py",
                                    "release_host.py",
                                    "helper.json",
                                )
                                or re.fullmatch(r"release_engine/[a-z_]+\.py", relative)
                            )
                        for directory in (partial / "release_engine", partial):
                            if directory.exists():
                                directory.chmod(0o700)
                        shutil.rmtree(partial)
                    old_intent.unlink()
                entries = list(tools.iterdir())
                require(
                    len(entries) < 40
                    and sum(p.lstat().st_blocks * 512 for p in tools.rglob("*"))
                    + 2 * len(raw)
                    < 4 * 1024 * 1024
                )
                require(not any(p.is_symlink() for p in tools.rglob("*")))
                intent = tools / (expected + ".intent")
                stage = tools / (expected + ".partial")
                if intent.exists():
                    require(intent.read_bytes() == expected.encode())
                    if stage.exists():
                        require(not stage.is_symlink())
                        for directory in (stage / "release_engine", stage):
                            if directory.exists():
                                directory.chmod(0o700)
                        shutil.rmtree(stage)
                else:
                    require(not stage.exists())
                    write(intent, expected.encode())
                stage.mkdir(mode=0o700)
                for name, data in decoded.items():
                    path = stage / name
                    path.parent.mkdir(mode=0o700, exist_ok=True)
                    write(path, data)
                    path.chmod(0o400)
                write(stage / "helper.json", canonical(package))
                for directory in (stage / "release_engine", stage):
                    fd = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
                    os.fsync(fd)
                    os.close(fd)
                os.rename(stage, target)
                for directory in (target / "release_engine", target):
                    directory.chmod(0o500)
                intent.unlink()
                fd = os.open(tools, os.O_RDONLY | os.O_DIRECTORY)
                os.fsync(fd)
                os.close(fd)
    print(json.dumps({"helper_sha256": expected}))


def bootstrap_source():
    # Gate values are compiled from the reviewed central constants, never CLI bypass options.
    return (
        f"DISK_REQUIRED = {DISK_RESERVE + PEAK_DISK}\n"
        f"INODES_REQUIRED = {INODE_ENVELOPE + INODE_RESERVE}\n"
        f"MEMORY_REQUIRED = {MEMORY_GATE}\n"
        + inspect.getsource(install)
        + "\ninstall()\n"
    )
