"""Build-once transaction coordinator. Origin acceptance and distribution are separate outcomes."""

import argparse
import json
import os
import re
import subprocess
import time
from pathlib import Path

from release_acceptance import accept
from release_engine.artifact import public_identity
from release_engine.protocol import ReleaseError, canonical, load_json, require
from release_transport import HostClient
from release_process import run


def accepted(state, identity):
    return (
        state.get("pending") is None
        and state.get("accepted") == state.get("serving") == identity["build_id"]
        and (state.get("last") or {}).get("id") == identity["build_id"]
        and state["last"].get("outcome") == "accepted"
    )


def reconcile(client, snapshot):
    lease = snapshot.get("lease")
    if lease is None:
        require(
            snapshot["state"]["pending"] is None,
            "pending release has no integration owner; postpone",
        )
        return
    require(
        lease["expires"] < snapshot["server_time"],
        "another bounded transaction owns this release lease; postpone",
    )
    if snapshot["state"]["pending"]:
        require(
            snapshot["state"]["pending"]["id"] == lease["id"],
            "lease and pending generation disagree",
        )
        deadline = time.monotonic() + 60
        result = client.call(
            "reconcile", lease=lease, timeout=deadline - time.monotonic()
        )
        require(
            result["pending"] is None
            and (result.get("last") or {}).get("outcome") == "failed",
            "previous generation recovery remains unresolved",
        )
        client.call("finish", lease=lease, timeout=deadline - time.monotonic())
        raise ReleaseError(
            "previous generation recovered; original failed outcome preserved; start a new reviewed run"
        )
    client.call("finish", lease=lease)


def transact(
    client, bundle, origin, fresh_master, publish, *, mode="deploy", browser=accept
):
    identity = load_json(bundle / "identity.json")
    manifest = load_json(bundle / "manifest.json")
    require(
        canonical(identity) == canonical(public_identity(manifest)),
        "runner artifact identity mismatch",
    )
    client.install()
    reconcile(client, client.call("status"))
    lease = client.call(
        "begin",
        request={
            "manifest": manifest,
            "policy": load_json(bundle / "policy.json"),
            "origin": origin,
            "mode": mode,
        },
    )
    origin_accepted = mode == "publish"
    distribution = False
    failure = None
    try:
        if mode == "deploy":
            require(
                fresh_master() == identity["source_sha"],
                "source became stale before preparation",
            )
            client.call("receive", lease=lease, archive=bundle / "build.tar.gz")
            client.call(
                "prepare", lease=lease, request={"fresh_master": fresh_master()}
            )
            started = time.monotonic()
            # This includes activation itself: HTTP/browser finish by 145 seconds,
            # acknowledgement by 165, leaving margin inside the engine's 180 seconds.
            client.call(
                "activate",
                lease=lease,
                request={"fresh_master": fresh_master()},
                timeout=35,
            )
            evidence = browser(origin, bundle, started + 145)
            result = client.call(
                "accept",
                lease=lease,
                request=evidence,
                timeout=min(20, started + 165 - time.monotonic()),
            )
            require(
                accepted(result, identity), "acceptance acknowledgement is not exact"
            )
            origin_accepted = True
            print(
                f"ORIGIN accepted identity={identity['build_id']} activation_to_ack_seconds={time.monotonic() - started:.3f}",
                flush=True,
            )
        else:
            browser(origin, bundle, time.monotonic() + 120)

        def publication_guard():
            snapshot = client.call("status", timeout=10)
            require(
                canonical(snapshot["lease"]) == canonical(lease)
                and lease["expires"] - snapshot["server_time"] > 60
                and accepted(snapshot["state"], identity),
                "publication lease/origin changed; no distribution overwrite",
            )

        publish(publication_guard)
        distribution = True
        print("DISTRIBUTION complete; origin remains accepted", flush=True)
        client.call("cleanup", lease=lease)
    except BaseException as exc:
        failure = exc
        # Lost acknowledgements are reconciled before deciding whether rollback is allowed.
        try:
            snapshot = client.call("status", timeout=10)
            origin_accepted = origin_accepted or accepted(snapshot["state"], identity)
            if not origin_accepted and snapshot["state"]["pending"]:
                require(
                    snapshot["state"]["pending"]["id"] == lease["id"],
                    "refuse recovery of a different generation",
                )
                client.call("recover", lease=lease, timeout=45)
        except (ReleaseError, OSError, subprocess.SubprocessError):
            print(
                "RECOVERY unconfirmed; independent guard remains responsible; exact status reconciliation required",
                flush=True,
            )
        print(
            f"OUTCOME origin_accepted={str(origin_accepted).lower()} distribution_complete={str(distribution).lower()}",
            flush=True,
        )
        raise
    finally:
        try:
            snapshot = client.call("status", timeout=10)
            if (
                snapshot["state"]["pending"] is None
                and snapshot.get("lease")
                and snapshot["lease"]["token"] == lease["token"]
            ):
                client.call("finish", lease=lease, timeout=30)
        except (ReleaseError, OSError, subprocess.SubprocessError):
            if failure is None:
                raise
            print("CLEANUP unconfirmed; original failure preserved", flush=True)
    return {"origin_accepted": origin_accepted, "distribution_complete": distribution}


def fresh_master(repository):
    result = run(
        [
            "gh",
            "api",
            f"repos/{repository}/git/ref/heads/master",
            "--jq",
            ".object.sha",
        ],
        text=True,
        timeout=10,
        check=True,
    )
    sha = result.stdout.strip()
    require(re.fullmatch(r"[0-9a-f]{40}", sha), "fresh master identity unavailable")
    return sha


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--preview", type=Path, required=True)
    parser.add_argument("--mode", choices=["deploy", "publish"], default="deploy")
    args = parser.parse_args()
    from release_distribution import publish

    repository = os.environ["GITHUB_REPOSITORY"]
    require(
        re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository),
        "invalid repository",
    )
    helpers = load_json(args.bundle / "helpers.json")
    client = HostClient(
        os.environ["DEPLOY_HOST"],
        os.environ["DEPLOY_USER"],
        os.environ["DEPLOY_KEY_FILE"],
        os.environ["DEPLOY_KNOWN_HOSTS_FILE"],
        os.environ["DEPLOY_PATH"],
        helpers,
    )
    try:
        result = transact(
            client,
            args.bundle,
            os.environ["RELEASE_ORIGIN"],
            lambda: fresh_master(repository),
            lambda guard: publish(
                repository, os.environ["TAG_NAME"], args.bundle, args.preview, guard
            ),
            mode=args.mode,
        )
        print(json.dumps(result, sort_keys=True))
    except (ReleaseError, OSError, subprocess.SubprocessError) as exc:
        print(
            (
                str(exc)
                if isinstance(exc, ReleaseError)
                else "release integration failed; inspect exact run outcome"
            ),
            flush=True,
        )
        raise SystemExit(2)
