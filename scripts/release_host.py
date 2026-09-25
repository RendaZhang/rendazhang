"""Bounded host entry point, executed only from a verified immutable helper directory."""

import argparse
import base64
import fcntl
import hashlib
import json
import os
import shutil
import signal
import sys
import time
from pathlib import Path

from release_engine.protocol import (
    MIB,
    ReleaseError,
    canonical,
    digest,
    load_json,
    require,
)
from release_engine.system import durable_json, locked
from release_engine.ownership import check_lease

LEASE_SECONDS = 600


def prune_incoming(engine, protected):
    from release_engine.artifact import public_identity

    incoming = engine.private / "incoming"
    for intent in incoming.glob("*.intent.json"):
        generation = intent.name.removesuffix(".intent.json")
        if generation in protected or intent.stat().st_mtime + 86400 >= engine.clock():
            continue
        ticket = load_json(intent)
        require(
            canonical(public_identity(ticket["manifest"]))
            == canonical(ticket["identity"])
            and ticket["identity"]["build_id"] == generation,
            "incoming cleanup ownership changed",
        )
        stage = incoming / generation
        require(not stage.is_symlink(), "linked incoming cleanup")
        if stage.exists():
            require(stage.is_dir(), "unowned incoming cleanup")
            if stage.stat().st_mtime + 86400 >= engine.clock():
                continue
            if (stage / "ticket.json").exists():
                require(
                    canonical(load_json(stage / "ticket.json")) == canonical(ticket),
                    "incoming ticket changed before cleanup",
                )
            shutil.rmtree(stage)
        intent.unlink()


def begin(engine, helper, request):
    from release_engine.artifact import public_identity
    from release_engine.origin import origin_url

    require(
        set(request) == {"manifest", "policy", "origin", "mode"}, "unknown begin fields"
    )
    require(request["mode"] in ("deploy", "publish"), "unknown release mode")
    origin_url(request["origin"])
    identity = public_identity(request["manifest"])
    generation = identity["build_id"]
    incoming = engine.private / "incoming"
    require(not incoming.is_symlink(), "linked incoming directory")
    incoming.mkdir(mode=0o700, exist_ok=True)
    lease_path = engine.private / "lease.json"
    with locked(engine.lock_path):
        verify_installed(engine.private / "tools" / helper, helper)
        engine._budget(additional_bytes=20 * MIB, additional_inodes=20)
        state = engine.status()
        require(state["pending"] is None, "unresolved release must be reconciled first")
        old = load_json(lease_path) if lease_path.exists() else None
        require(
            old is None or old["expires"] < engine.clock(),
            "another release transaction owns the host",
        )
        if request["mode"] == "publish":
            require(
                state["accepted"] is not None
                and canonical(engine._view(state["accepted"])["identity"])
                == canonical(identity)
                and state["last"]["outcome"] == "accepted",
                "mirror retry is not the accepted origin",
            )
        prune_incoming(engine, {old["id"]} if old else set())
        stage = incoming / generation
        require(not stage.is_symlink(), "linked incoming generation")
        if not stage.exists():
            require(
                sum(path.is_dir() for path in incoming.iterdir()) < 3,
                "incoming quota exhausted; postpone",
            )
        # Artifact/helper identity is immutable; operation mode belongs only to the lease.
        ticket = {key: value for key, value in request.items() if key != "mode"}
        ticket.update(identity=identity, helper=helper)
        intent = incoming / (generation + ".intent.json")
        if intent.exists():
            require(
                canonical(load_json(intent)) == canonical(ticket),
                "incoming intent changed",
            )
        else:
            durable_json(intent, ticket)
        stage.mkdir(mode=0o700, exist_ok=True)
        if (stage / "ticket.json").exists():
            require(
                canonical(load_json(stage / "ticket.json")) == canonical(ticket),
                "incoming generation changed",
            )
        else:
            durable_json(stage / "ticket.json", ticket)
        lease = {
            "id": generation,
            "token": os.urandom(16).hex(),
            "helper": helper,
            "expires": engine.clock() + LEASE_SECONDS,
            "expected": state["serving"],
            "mode": request["mode"],
        }
        durable_json(stage / "manifest.json", request["manifest"])
        durable_json(
            stage / "engine-policy.json",
            {"script_hashes": request["policy"]["script_hashes"]},
        )
        durable_json(
            engine.private / (generation + ".http.json"),
            {
                "origin": request["origin"],
                "policy": request["policy"],
                "helper": helper,
                "identity": identity,
            },
        )
        durable_json(lease_path, lease)
    return lease


def finish(engine, ownership):
    with locked(engine.lock_path):
        lease = check_lease(
            engine.private, ownership, ownership["id"], "finish", engine.clock()
        )
        state = engine.status()
        require(state["pending"] is None, "cannot release unresolved transaction")
        engine.guard.assert_collected(engine.root, lease["id"])
        incoming = engine.private / "incoming"
        stage = incoming / lease["id"]
        require(not stage.is_symlink(), "linked incoming generation")
        if stage.exists():
            ticket = load_json(stage / "ticket.json")
            require(
                ticket["identity"]["build_id"] == lease["id"]
                and ticket["helper"] == lease["helper"],
                "unowned transfer workspace",
            )
            # This resolved transaction owns its transfer files, not retained serving assets.
            shutil.rmtree(stage)
        (incoming / (lease["id"] + ".intent.json")).unlink(missing_ok=True)
        prune_incoming(engine, set())
        protected = {lease["id"]}
        for view in (state["accepted"], state["previous"]):
            if view:
                protected.add(engine._view(view)["identity"]["build_id"])
        for path in engine.private.glob("*.http.json"):
            if (
                path.name.removesuffix(".http.json") not in protected
                and path.stat().st_mtime + 86400 < engine.clock()
            ):
                require(not path.is_symlink(), "linked HTTP contract")
                contract = load_json(path)
                require(
                    set(contract) == {"origin", "policy", "helper", "identity"}
                    and contract["identity"]["build_id"]
                    == path.name.removesuffix(".http.json"),
                    "unowned HTTP contract cleanup",
                )
                path.unlink()
        (engine.private / "lease.json").unlink()
    return {"finished": True}


def verified_helper():
    directory = Path(__file__).resolve().parent
    return directory, verify_installed(directory, directory.name)


def verify_installed(directory, expected):
    require(not directory.is_symlink(), "linked helper package")
    package = load_json(directory / "helper.json", MIB)
    require(
        package["sha256"]
        == directory.name
        == expected
        == digest(canonical(package["files"])),
        "helper package identity mismatch",
    )
    for name, encoded in package["files"].items():
        path = directory / name
        require(
            not path.is_symlink()
            and path.read_bytes() == base64.b64decode(encoded, validate=True),
            "immutable helper changed",
        )
    return package["sha256"]


def load_input():
    data = sys.stdin.buffer.read(2 * MIB + 1)
    require(len(data) <= 2 * MIB, "host request exceeds limit")
    value = json.loads(data)
    require(isinstance(value, dict), "invalid host request")
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "action",
        choices=[
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
        ],
    )
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--generation")
    parser.add_argument("--token")
    args = parser.parse_args()
    signal.alarm(110 if args.action == "receive" else 40)
    try:
        directory, helper = verified_helper()
        root = args.root
        require(
            root.is_absolute()
            and root == root.resolve(strict=True)
            and root.name != "html",
            "release parent must be lexical and unlinked",
        )
        private = root / ".release-state"
        lease_path = private / "lease.json"
        incoming = private / "incoming"
        require(not incoming.is_symlink(), "linked incoming directory")
        incoming.mkdir(mode=0o700, exist_ok=True)
        if args.action == "status":
            from release_engine.engine import Engine

            state = Engine(root).status()
            lease = load_json(lease_path) if lease_path.exists() else None
            print(
                json.dumps({"state": state, "lease": lease, "server_time": time.time()})
            )
            return 0
        if args.action == "begin":
            from release_engine.engine import Engine

            lease = begin(Engine(root), helper, load_input())
            print(json.dumps(lease))
            return 0
        require(args.generation and args.token, "release ownership is required")
        ownership = {"id": args.generation, "token": args.token, "helper": helper}
        lease = check_lease(
            private, ownership, args.generation, args.action, time.time()
        )
        stage = incoming / lease["id"]
        ticket = load_json(stage / "ticket.json")
        if args.action == "receive":
            require(lease["mode"] == "deploy", "mirror retry cannot upload")
            manifest = ticket["manifest"]
            archive = stage / "build.tar.gz"
            partial = stage / "build.partial"
            from release_engine.engine import Engine

            Engine(root)._budget(
                additional_bytes=manifest["archive_bytes"], additional_inodes=2
            )
            require(
                lease["expires"] - time.time() >= 120,
                "insufficient upload lease window",
            )
            with (private / "upload.lock").open("a") as upload_lock:
                fcntl.flock(upload_lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                partial.unlink(missing_ok=True)
                sha = hashlib.sha256()
                remaining = manifest["archive_bytes"]
                with partial.open("xb") as output:
                    while remaining:
                        block = sys.stdin.buffer.read(min(65536, remaining))
                        require(block, "interrupted upload")
                        output.write(block)
                        sha.update(block)
                        remaining -= len(block)
                    require(not sys.stdin.buffer.read(1), "oversized upload")
                    output.flush()
                    os.fsync(output.fileno())
                require(
                    sha.hexdigest() == manifest["archive_sha256"],
                    "upload digest mismatch",
                )
                with locked(private / "lock"):
                    check_lease(
                        private, ownership, args.generation, "receive", time.time()
                    )
                    os.replace(partial, archive)
            print(json.dumps({"received": True}))
            return 0
        if args.action == "finish":
            from release_engine.engine import Engine

            print(json.dumps(finish(Engine(root), ownership)))
            return 0
        require(
            lease["mode"] == "deploy" or args.action == "cleanup",
            "mirror retry cannot activate or recover",
        )
        action = "recover" if args.action == "reconcile" else args.action
        # The runner starts this entry point as the hard-bounded systemd worker already.
        require(
            os.environ.get("RELEASE_WORKER_KEY", "").startswith(lease["id"] + "-"),
            "host mutation requires its bounded worker",
        )
        arguments = [
            str(directory / "release.py"),
            "worker",
            "--operation",
            action,
            "--root",
            str(root),
            "--generation",
            lease["id"],
            "--lease-token",
            lease["token"],
            "--helper",
            helper,
        ]
        if args.action == "reconcile":
            arguments.append("--reconcile")
        if args.action in ("prepare", "activate"):
            request = load_input()
            require(set(request) == {"fresh_master"}, "unknown activation input")
            arguments.extend(
                [
                    "--expected",
                    lease["expected"],
                    "--fresh-master",
                    request["fresh_master"],
                ]
            )
        if args.action == "prepare":
            arguments.extend(
                [
                    "--archive",
                    str(stage / "build.tar.gz"),
                    "--manifest",
                    str(stage / "manifest.json"),
                    "--csp",
                    str(stage / "engine-policy.json"),
                ]
            )
        if args.action == "accept":
            evidence = load_input()
            require(
                evidence
                == {"identity": ticket["identity"], "origin": True, "browser": True},
                "inexact acceptance evidence",
            )
            durable_json(stage / "evidence.json", evidence)
            arguments.extend(["--evidence", str(stage / "evidence.json")])
        os.execv(sys.executable, [sys.executable, "-B", *arguments])
    except (ReleaseError, OSError, ValueError, KeyError, TypeError) as exc:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": (
                        str(exc)
                        if isinstance(exc, ReleaseError)
                        else "host integration failed"
                    ),
                }
            ),
            file=sys.stderr,
        )
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
