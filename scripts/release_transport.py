"""Runner-only strict SSH transport; every remote lock owner is a bounded transient unit."""

import json
import os
import re
import shlex
import subprocess
from pathlib import Path, PurePosixPath

from release_bootstrap import bootstrap_source
from release_engine.protocol import MIB, ReleaseError, canonical, require
from release_engine.system import unit_name
from release_process import run


def release_parent(value):
    path = PurePosixPath(value)
    require(
        path.is_absolute()
        and str(path) == value
        and path.name == "html"
        and ".." not in path.parts
        and len(path.parts) >= 3,
        "DEPLOY_PATH must be a lexical absolute html path",
    )
    return str(path.parent)


def bounded_unit(root, generation, command, seconds):
    require(
        re.fullmatch(r"[A-Za-z0-9_-]{1,160}", generation), "invalid remote generation"
    )
    key = generation + "-" + os.urandom(8).hex()
    return [
        "systemd-run",
        "--quiet",
        "--wait",
        "--collect",
        "--pipe",
        "--unit=" + unit_name(Path(root), key, "worker"),
        "--setenv=RELEASE_WORKER_KEY=" + key,
        "--service-type=exec",
        "--property=MemoryMax=32M",
        f"--property=RuntimeMaxSec={seconds}",
        "--property=TimeoutStopSec=2",
        "--property=KillMode=control-group",
        *command,
    ]


class HostClient:
    def __init__(self, host, user, key, known_hosts, deploy_path, helpers):
        require(
            re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9.-]{0,252}", host),
            "invalid deployment host",
        )
        require(
            re.fullmatch(r"[a-z_][a-z0-9_-]{0,31}", user), "invalid deployment user"
        )
        self.root = release_parent(deploy_path)
        self.helpers = helpers
        require(
            re.fullmatch(r"[0-9a-f]{64}", helpers["sha256"]), "invalid helper identity"
        )
        self.helper = helpers["sha256"]
        self.ssh = [
            "ssh",
            "-F",
            "/dev/null",
            "-o",
            "BatchMode=yes",
            "-o",
            "StrictHostKeyChecking=yes",
            "-o",
            "UserKnownHostsFile=" + str(known_hosts),
            "-o",
            "IdentitiesOnly=yes",
            "-o",
            "ConnectTimeout=10",
            "-o",
            "ServerAliveInterval=5",
            "-o",
            "ServerAliveCountMax=2",
            "-i",
            str(key),
            user + "@" + host,
        ]

    def _invoke(self, command, *, data=None, stream=None, timeout=45):
        try:
            options = {"input": data} if stream is None else {"stdin": stream}
            result = run(
                [*self.ssh, shlex.join(command)],
                timeout=timeout,
                **options,
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise ReleaseError(
                "bounded SSH transport unavailable; reconcile exact generation"
            ) from exc
        require(
            len(result.stdout) <= 2 * MIB and result.returncode in (0, 2),
            "remote operation failed; inspect exact generation status",
        )
        try:
            state = json.loads(result.stdout)
        except ValueError as exc:
            raise ReleaseError(
                "remote outcome unavailable; reconcile exact generation"
            ) from exc
        require(
            isinstance(state, dict) and state.get("ok") is not False,
            "remote operation rejected",
        )
        return state

    def install(self):
        command = bounded_unit(
            self.root,
            "install-" + self.helper[:24],
            [
                "/usr/bin/python3",
                "-B",
                "-c",
                bootstrap_source(),
                self.root,
                self.helper,
            ],
            20,
        )
        result = self._invoke(command, data=canonical(self.helpers), timeout=35)
        require(
            result == {"helper_sha256": self.helper},
            "installed helper identity mismatch",
        )

    def call(self, action, *, lease=None, request=None, archive=None, timeout=None):
        require(
            action
            in {
                "status",
                "begin",
                "receive",
                "prepare",
                "activate",
                "accept",
                "recover",
                "reconcile",
                "cleanup",
                "finish",
            },
            "unknown remote action",
        )
        generation = lease["id"] if lease else action
        helper = lease["helper"] if lease else self.helper
        require(re.fullmatch(r"[0-9a-f]{64}", helper), "invalid pinned helper")
        entry = str(
            PurePosixPath(self.root)
            / ".release-state"
            / "tools"
            / helper
            / "release_host.py"
        )
        command = ["/usr/bin/python3", "-B", entry, action, "--root", self.root]
        if lease:
            command.extend(["--generation", generation, "--token", lease["token"]])
        seconds = 110 if action == "receive" else 30
        command = bounded_unit(self.root, generation, command, seconds)
        timeout = min(seconds + 15, timeout) if timeout is not None else seconds + 15
        require(timeout > 0, "remote operation deadline exhausted")
        if archive:
            with Path(archive).open("rb") as stream:
                return self._invoke(command, stream=stream, timeout=timeout)
        return self._invoke(
            command,
            data=canonical(request) if request is not None else b"",
            timeout=timeout,
        )
