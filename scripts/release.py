"""Release engine CLI. NOT wired into the production deployment workflow."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from release_engine.artifact import ReleaseError, load_json, pack, public_identity
from release_engine.engine import Engine
from release_engine.system import run_worker


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "action",
        choices=[
            "pack",
            "prepare",
            "activate",
            "accept",
            "recover",
            "status",
            "cleanup",
            "guard",
            "worker",
        ],
    )
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--archive", type=Path)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--source")
    parser.add_argument("--run", type=int)
    parser.add_argument("--attempt", type=int)
    parser.add_argument("--expected")
    parser.add_argument("--fresh-master")
    parser.add_argument("--csp", type=Path)
    parser.add_argument("--generation")
    parser.add_argument("--evidence", type=Path)
    parser.add_argument("--target")
    parser.add_argument(
        "--operation", choices=["prepare", "activate", "accept", "recover", "cleanup"]
    )
    args = parser.parse_args()
    try:
        if args.action == "pack":
            result = pack(
                args.root,
                args.archive,
                args.manifest,
                args.source,
                args.run,
                args.attempt,
            )
        else:
            engine = Engine(args.root)
            action = args.operation if args.action == "worker" else args.action
            envelope = load_json(args.manifest) if args.manifest else None
            generation = args.generation or (
                public_identity(envelope)["build_id"] if envelope else "maintenance"
            )
            if args.action not in ("worker", "status", "guard"):
                arguments = sys.argv[2:] + ["--operation", args.action]
                result = run_worker(engine.root, generation, arguments)
            elif action == "prepare":
                policy = load_json(args.csp)
                if set(policy) != {"script_hashes"} or not isinstance(
                    policy["script_hashes"], list
                ):
                    raise ReleaseError("invalid CSP contract")
                result = engine.prepare(
                    args.archive,
                    envelope,
                    expected=args.expected,
                    fresh_master=args.fresh_master,
                    csp=set(policy["script_hashes"]),
                )
            elif action == "activate":
                result = engine.activate(
                    generation, expected=args.expected, fresh_master=args.fresh_master
                )
            elif action == "accept":
                result = engine.accept(generation, load_json(args.evidence))
            elif action == "recover":
                result = engine.recover(generation, target=args.target)
            elif action == "cleanup":
                result = engine.cleanup()
            elif action == "guard":
                engine.guard_loop(generation)
                result = engine.status()
            else:
                result = engine.status()
        print(json.dumps(result, sort_keys=True))
        if (result.get("last") or {}).get("outcome") == "failed":
            return 2
        return 0
    except (ReleaseError, OSError, ValueError, TypeError, KeyError) as exc:
        message = (
            str(exc)
            if isinstance(exc, ReleaseError)
            else "invalid input or local operation failed"
        )
        print(json.dumps({"ok": False, "error": message}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
