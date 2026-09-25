"""Create/verify an immutable runner bundle from one existing build; never rebuild."""

import argparse
import base64
import json
import os
from pathlib import Path

from release_engine.artifact import pack, public_identity, unpack, validate_site
from release_engine.protocol import MIB, canonical, digest, load_json, require

SCRIPTS = Path(__file__).resolve().parent


def helper_package():
    paths = [
        SCRIPTS / "release.py",
        SCRIPTS / "release_host.py",
        *sorted((SCRIPTS / "release_engine").glob("*.py")),
    ]
    files = {
        path.relative_to(SCRIPTS)
        .as_posix(): base64.b64encode(path.read_bytes())
        .decode()
        for path in paths
    }
    package = {"files": files, "sha256": digest(canonical(files))}
    require(len(canonical(package)) <= MIB, "helper package too large")
    return package


def verify(bundle: Path, preview: Path):
    envelope = load_json(bundle / "manifest.json")
    identity = public_identity(envelope)
    require(load_json(bundle / "identity.json") == identity, "bundle identity mismatch")
    helper = load_json(bundle / "helpers.json", MIB)
    require(
        helper["sha256"] == digest(canonical(helper["files"])),
        "helper identity mismatch",
    )
    policy = load_json(bundle / "policy.json")
    unpack(bundle / "build.tar.gz", envelope, preview)
    validate_site(
        preview,
        envelope["payload"]["files"],
        set(policy["script_hashes"]),
        envelope["payload"]["dependencies"],
    )
    (preview / "release-identity.json").write_bytes(canonical(identity))
    os.chmod(preview / "release-identity.json", 0o644)
    return identity


def create(dist: Path, bundle: Path, source: str, run: int, attempt: int):
    bundle.mkdir(mode=0o700)
    identity = pack(
        dist, bundle / "build.tar.gz", bundle / "manifest.json", source, run, attempt
    )
    (bundle / "identity.json").write_bytes(canonical(identity))
    (bundle / "helpers.json").write_bytes(canonical(helper_package()))
    (bundle / "policy.json").write_bytes((SCRIPTS / "release-policy.json").read_bytes())
    return identity


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["create", "verify"])
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--dist", type=Path)
    parser.add_argument("--preview", type=Path)
    parser.add_argument("--source")
    parser.add_argument("--run", type=int)
    parser.add_argument("--attempt", type=int)
    args = parser.parse_args()
    if args.action == "create":
        result = create(args.dist, args.bundle, args.source, args.run, args.attempt)
    else:
        result = verify(args.bundle, args.preview)
    print(json.dumps(result, sort_keys=True))
