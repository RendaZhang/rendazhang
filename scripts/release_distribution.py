"""Runner publication of an already accepted immutable artifact; never activates origin."""

import base64
import json
import os
import re
import shutil
import tempfile
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from release_engine.protocol import ReleaseError, canonical, load_json, require
from release_engine.origin import absolute_deadline
from release_process import run as run_process


def api(repository, path, *, method="GET", data=None, missing=False):
    request = Request(
        f"https://api.github.com/repos/{repository}/{path}",
        method=method,
        data=canonical(data) if data is not None else None,
        headers={
            "Authorization": "Bearer " + os.environ["GH_TOKEN"],
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with absolute_deadline(time.monotonic() + 10), urlopen(
            request, timeout=10
        ) as response:
            body = response.read(2 * 1024 * 1024 + 1)
            require(len(body) <= 2 * 1024 * 1024, "GitHub response exceeds limit")
            return json.loads(body) if body else None
    except HTTPError as exc:
        if missing and exc.code == 404:
            return None
        raise ReleaseError("required GitHub publication operation failed") from exc


def publish(repository, tag, bundle, preview, guard):
    with absolute_deadline(time.monotonic() + 150):
        return _publish(repository, tag, bundle, preview, guard)


def _publish(repository, tag, bundle, preview, guard):
    require(
        re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,79}", tag),
        "invalid fixed distribution tag",
    )
    identity = load_json(bundle / "identity.json")
    branch = "release/" + tag
    guard()
    previous = api(repository, "git/ref/heads/" + branch, missing=True)
    parent = previous["object"]["sha"] if previous else None
    auth = base64.b64encode(
        ("x-access-token:" + os.environ["GH_TOKEN"]).encode()
    ).decode()
    env = dict(
        os.environ,
        GIT_CONFIG_COUNT="1",
        GIT_CONFIG_KEY_0="http.https://github.com/.extraheader",
        GIT_CONFIG_VALUE_0="AUTHORIZATION: basic " + auth,
        GIT_AUTHOR_NAME="github-actions",
        GIT_AUTHOR_EMAIL="github-actions@github.com",
        GIT_COMMITTER_NAME="github-actions",
        GIT_COMMITTER_EMAIL="github-actions@github.com",
    )
    with tempfile.TemporaryDirectory(prefix="release-distribution-") as tmp:
        tree = Path(tmp) / "tree"
        shutil.copytree(preview, tree)

        def git(*args):
            return run_process(
                ["git", "-C", str(tree), *args],
                env=env,
                check=True,
                text=True,
                timeout=45,
            ).stdout.strip()

        git("init", "--quiet")
        remote = f"https://github.com/{repository}.git"
        if parent:
            git("fetch", "--depth=1", remote, "refs/heads/" + branch)
            require(
                git("rev-parse", "FETCH_HEAD") == parent,
                "distribution ref changed before publication",
            )
            listing = git(
                "ls-tree", "--name-only", "FETCH_HEAD", "release-identity.json"
            )
            if listing:
                prior = json.loads(git("show", "FETCH_HEAD:release-identity.json"))
                rank = (identity["run_id"], identity["attempt"])
                old_rank = (prior["run_id"], prior["attempt"])
                require(
                    old_rank < rank or canonical(prior) == canonical(identity),
                    "newer/different distribution cannot be overwritten",
                )
        git("add", "--all")
        sha = git(
            "commit-tree",
            git("write-tree"),
            *(["-p", parent] if parent else []),
            "-m",
            "Release " + tag + " " + identity["build_id"],
        )
        guard()
        # The fixed distribution branch now advances normally, including mirror retries.
        git("push", remote, sha + ":refs/heads/" + branch)
    guard()
    existing = api(repository, "git/ref/tags/" + tag, missing=True)
    if existing and existing["object"]["sha"] != sha:
        guard()
        api(repository, "git/refs/tags/" + tag, method="DELETE")
        existing = None
    if not existing:
        guard()
        api(
            repository,
            "git/refs",
            method="POST",
            data={"ref": "refs/tags/" + tag, "sha": sha},
        )
    guard()
    release = api(repository, "releases/tags/" + tag, missing=True)
    details = {
        "tag_name": tag,
        "name": tag,
        "body": f"Origin accepted `{identity['build_id']}` from `{identity['source_sha']}`. The attached immutable archive and manifest identify the published bytes.",
        "draft": False,
        "prerelease": False,
    }
    guard()
    api(
        repository,
        f"releases/{release['id']}" if release else "releases",
        method="PATCH" if release else "POST",
        data=details,
    )
    guard()
    with tempfile.TemporaryDirectory(prefix="release-metadata-") as tmp:
        checksum = Path(tmp) / "build.tar.gz.sha256"
        checksum.write_text(identity["archive_sha256"] + "  build.tar.gz\n")
        info = Path(tmp) / "build-info.txt"
        info.write_text(
            f"Commit: {identity['source_sha']}\nTag: {tag}\nBuild: {identity['build_id']}\n"
        )
        run_process(
            [
                "gh",
                "release",
                "upload",
                tag,
                str(bundle / "build.tar.gz"),
                str(bundle / "manifest.json"),
                str(bundle / "identity.json"),
                str(checksum),
                str(info),
                "--repo",
                repository,
                "--clobber",
            ],
            check=True,
            timeout=45,
        )
    guard()
    with absolute_deadline(time.monotonic() + 10), urlopen(
        f"https://purge.jsdelivr.net/gh/{repository}@{tag}", timeout=10
    ) as response:
        require(
            response.status == 200, "required CDN purge failed; origin remains accepted"
        )


def download_retry(repository, run_id, attempt, destination):
    require(
        type(run_id) is int and run_id > 0 and type(attempt) is int and attempt > 0,
        "invalid retry run/attempt",
    )
    run = api(repository, f"actions/runs/{run_id}")
    require(
        run["head_branch"] == "master"
        and run["path"] == ".github/workflows/deploy.yml"
        and run["event"] in ("push", "workflow_dispatch")
        and run["run_attempt"] >= attempt,
        "retry artifact is not from the master deployment workflow",
    )
    run_process(
        [
            "gh",
            "run",
            "download",
            str(run_id),
            "--repo",
            repository,
            "--name",
            f"frontend-release-{run_id}-{attempt}",
            "--dir",
            str(destination),
        ],
        check=True,
        timeout=60,
    )
    identity = load_json(destination / "identity.json")
    require(
        identity["source_sha"] == run["head_sha"]
        and identity["run_id"] == run_id
        and identity["attempt"] == attempt,
        "downloaded retry identity differs from exact source run",
    )
