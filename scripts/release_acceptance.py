"""Runner HTTP and external Playwright checks under one deadline; never builds."""

import argparse
import os
import sys
import time
from pathlib import Path

from release_engine.origin import check_origin
from release_engine.protocol import load_json, require
from release_process import run


def accept(origin, bundle, deadline):
    started = time.monotonic()
    identity = load_json(bundle / "identity.json")
    manifest = load_json(bundle / "manifest.json")
    policy = load_json(bundle / "policy.json")
    check_origin(
        origin,
        identity,
        manifest["payload"]["files"],
        policy,
        min(deadline, started + 20),
    )
    remaining = min(95, deadline - time.monotonic())
    require(remaining > 0, "acceptance deadline exhausted before browser")
    env = dict(
        os.environ,
        SMOKE_MODE="external",
        RELEASE_ORIGIN=origin,
        RELEASE_BUNDLE=str(bundle.resolve()),
    )
    result = run(
        [
            "node",
            "node_modules/@playwright/test/cli.js",
            "test",
            "--config=playwright.acceptance.config.ts",
        ],
        env=env,
        check=False,
        timeout=remaining,
        text=True,
    )
    print(result.stdout, end="", flush=True)
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr, flush=True)
    result.check_returncode()
    require(time.monotonic() < deadline, "acceptance acknowledgement margin exhausted")
    print(
        f"ACCEPTANCE external_http_browser_seconds={time.monotonic() - started:.3f}",
        flush=True,
    )
    return {"identity": identity, "origin": True, "browser": True}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", required=True)
    parser.add_argument("--bundle", type=Path, required=True)
    args = parser.parse_args()
    accept(args.origin, args.bundle, time.monotonic() + 120)
