"""Durable local transactions. Network/browser evidence is supplied by later integration."""

from __future__ import annotations

import os
import re
import shutil
import time
from pathlib import Path

from .artifact import (
    ASSET_COUNT,
    ASSET_LIMIT,
    BASE_LIMIT,
    FILE_LIMIT,
    IDENTITY,
    MIB,
    ReleaseError,
    canonical,
    digest,
    inventory,
    is_asset,
    is_hashed,
    load_json,
    public_identity,
    require,
    unpack,
    validate_site,
)
from .system import (
    ACCEPT_SECONDS,
    INODE_ENVELOPE,
    PEAK_DISK,
    SystemdGuard,
    admit,
    capacity,
    durable_json,
    exchange,
    fsync_dir,
    guard_receipt,
    locked,
    point,
    sync_tree,
)

RETENTION = 7 * 86400
NAME = re.compile(r"[a-zA-Z0-9_-]{1,160}\Z")


class Engine:
    def __init__(
        self,
        root: Path,
        *,
        capacity_provider=capacity,
        clock=time.time,
        guard=None,
        checkpoint=lambda _name: None,
    ):
        self.root = root.resolve(strict=True)
        require(self.root.is_dir(), "release root missing")
        require(
            self.root.stat().st_uid == os.geteuid()
            and not self.root.stat().st_mode & 0o022,
            "release root ownership is unsafe",
        )
        self.private = self.root / ".release-state"
        self.views = self.root / "releases"
        for path, mode in ((self.private, 0o700), (self.views, 0o755)):
            require(not path.is_symlink(), "linked engine directory")
            path.mkdir(mode=mode, exist_ok=True)
            require(
                path.stat().st_uid == os.geteuid() and not path.stat().st_mode & 0o022,
                "unsafe engine directory",
            )
        self.capacity_provider, self.clock = capacity_provider, clock
        self.guard = guard if guard is not None else SystemdGuard()
        self.checkpoint = checkpoint
        self.html = self.root / "html"
        self.state_path = self.private / "state.json"
        self.lock_path = self.private / "lock"

    def _load(self):
        if not self.state_path.exists():
            return {
                "schema": 1,
                "accepted": None,
                "previous": None,
                "pending": None,
                "highwater": [0, 0],
                "retired": {},
                "last": None,
                "expired_views": {},
                "migration": None,
            }
        state = load_json(self.state_path)
        require(state.get("schema") == 1, "state schema mismatch")
        return state

    def _save(self, state, label):
        self.checkpoint("before_" + label)
        durable_json(self.state_path, state)
        self.checkpoint("after_" + label)

    def _path(self, name):
        require(isinstance(name, str) and NAME.fullmatch(name), "invalid view identity")
        return self.views / name

    def _metadata(self, name):
        self._path(name)
        return self.private / (name + ".json")

    def _view(self, name):
        record = load_json(self._metadata(name))
        require(record["view"] == name, "view identity mismatch")
        return record

    def _verify(self, name):
        record = self._view(name)
        actual = inventory(
            self._path(name),
            limit=BASE_LIMIT + ASSET_LIMIT,
            count=FILE_LIMIT + ASSET_COUNT,
            generated=True,
        )
        require(actual == record["files"], "retained view changed")
        require(
            load_json(self._path(name) / IDENTITY) == record["identity"],
            "public identity mismatch",
        )
        validate_site(
            self._path(name), actual, set(record["csp"]), record["dependencies"]
        )
        return record

    def _make_record(self, name, identity, files, csp, base_files, dependencies=None):
        path = self._path(name)
        with (path / IDENTITY).open("xb") as stream:
            stream.write(canonical(identity))
        os.chmod(path / IDENTITY, 0o644)
        record = {
            "view": name,
            "identity": identity,
            "files": files,
            "base_files": base_files,
            "csp": sorted(csp),
            "created": self.clock(),
            "dependencies": dependencies or {},
        }
        sync_tree(path)
        durable_json(self._metadata(name), record)
        fsync_dir(self.views)
        return record

    def _real_identity(self):
        return "bootstrap-" + digest(canonical(inventory(self.html)))[:24]

    def _actual(self):
        if self.html.is_symlink():
            actual = self.html.resolve(strict=True)
            require(actual.parent == self.views, "unowned serving pointer")
            return actual.name
        require(self.html.is_dir(), "serving root unavailable")
        return self._real_identity()

    def status(self):
        state = self._load()
        state["serving"] = self._actual()
        return state

    def _budget(self, *, additional_bytes=0, additional_inodes=0):
        admit(self.capacity_provider(self.root))
        size = count = 0
        roots = [self.private, self.views]
        if not self.html.is_symlink():
            roots.append(self.html)
        migration = self._load()["migration"]
        if migration:
            swap = self.root / migration["swap"]
            require(
                swap.parent == self.root and swap.name.startswith(".release-swap-"),
                "invalid migration path",
            )
            if not swap.is_symlink() and swap.is_dir():
                roots.append(swap)
        for root in roots:
            for directory, dirs, names in os.walk(root, followlinks=False):
                for name in dirs + names:
                    path = Path(directory) / name
                    require(not path.is_symlink(), "unexpected managed symlink")
                    size += path.lstat().st_blocks * 512
                    count += 1
        # Reserve three maximum archives outside the owned tree and allocation rounding overhead.
        require(
            size + additional_bytes + 48 * MIB <= PEAK_DISK
            and count + additional_inodes <= INODE_ENVELOPE,
            "managed allocation envelope exceeded",
        )

    def _bootstrap(self, csp):
        name = self._real_identity()
        files = inventory(self.html)
        validate_site(self.html, files, csp)
        if self._metadata(name).exists():
            self._verify(name)
            return name
        intent_path = self.private / "bootstrap-intent.json"
        if intent_path.exists():
            require(
                load_json(intent_path) == {"view": name},
                "bootstrap intent disagrees with serving bytes",
            )
            if self._path(name).exists():
                require(not self._path(name).is_symlink(), "linked bootstrap staging")
                shutil.rmtree(self._path(name))
        else:
            require(not self._path(name).exists(), "unowned incomplete bootstrap")
            durable_json(intent_path, {"view": name})
        self.checkpoint("before_bootstrap_copy")

        def copy_file(source, target):
            result = shutil.copy2(source, target)
            self.checkpoint("during_bootstrap_copy")
            return result

        shutil.copytree(self.html, self._path(name), copy_function=copy_file)
        require(
            inventory(self._path(name)) == files and self._real_identity() == name,
            "serving bytes changed during bootstrap copy",
        )
        identity = {
            "build_id": name,
            "source_sha": None,
            "run_id": None,
            "attempt": None,
            "payload_sha256": digest(canonical(files)),
            "archive_sha256": None,
        }
        self._make_record(name, identity, files, csp, files)
        self.checkpoint("after_bootstrap_copy")
        return name

    def _retired(self, state):
        return {
            name: record
            for name, record in state["retired"].items()
            if record["at"] + RETENTION > self.clock()
        }

    def _guard_window(self, pending, seconds, recover_seconds):
        key = os.environ.get("RELEASE_WORKER_KEY", pending["id"])
        require(
            NAME.fullmatch(key)
            and (key == pending["id"] or key.startswith(pending["id"] + "-")),
            "invalid worker ownership key",
        )
        pending.update(
            guard_token=os.urandom(16).hex(),
            worker_key=key,
            deadline=self.clock() + seconds,
            recover_by=self.clock() + recover_seconds,
        )

    def prepare(
        self,
        archive: Path,
        envelope: dict,
        *,
        expected: str,
        fresh_master: str,
        csp: set[str],
    ):
        identity = public_identity(envelope)
        generation = identity["build_id"]
        rank = [identity["run_id"], identity["attempt"]]
        with locked(self.lock_path):
            state = self._load()
            require(
                identity["source_sha"] == fresh_master, "source is not fresh master"
            )
            if (
                state["accepted"]
                and self._view(state["accepted"])["identity"] == identity
            ):
                return self.status()
            if state["pending"] and state["pending"]["id"] == generation:
                require(
                    state["pending"]["phase"] == "prepared"
                    and state["pending"]["expected"] == expected
                    and self._verify(state["pending"]["candidate"])["identity"]
                    == identity,
                    "unresolved transaction",
                )
                return self.status()
            require(state["pending"] is None, "unresolved transaction")
            require(rank > state["highwater"], "stale run generation")
            require(
                self._actual() == expected, "previous accepted compare-and-swap failed"
            )
            require(
                state["accepted"] is None or state["accepted"] == expected,
                "serving and accepted state disagree",
            )
            self._budget(
                additional_bytes=2 * (BASE_LIMIT + ASSET_LIMIT) + BASE_LIMIT + 64 * MIB,
                additional_inodes=18000,
            )
            prior = state["accepted"] or self._bootstrap(csp)
            previous = self._verify(prior)
            retired = self._retired(state)
            # Retiring this version must fit the promise before exposing a new one.
            retired[previous["identity"]["build_id"]] = {
                "at": self.clock(),
                "assets": {
                    p: e for p, e in previous["base_files"].items() if is_hashed(p)
                },
            }
            require(
                len(set(retired) | {generation}) <= 20,
                "retired manifest quota exhausted",
            )
            candidate = generation
            rollback = "rollback-" + generation
            require(
                not self._path(candidate).exists()
                and not self._path(rollback).exists(),
                "immutable candidate already exists",
            )
            unpack(archive, envelope, self._path(candidate))
            incoming = dict(envelope["payload"]["files"])
            for path, entry in previous["base_files"].items():
                if path.startswith(".well-known/"):
                    require(
                        path not in incoming or incoming[path] == entry,
                        "well-known content collision",
                    )
                    if path not in incoming:
                        target = self._path(candidate) / path
                        target.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copyfile(self._path(prior) / path, target)
                        os.chmod(target, 0o644)
                        incoming[path] = entry
                elif is_asset(path) and not is_hashed(path):
                    require(
                        incoming.get(path) == entry, "incompatible unversioned resource"
                    )
            require(
                sum(e["bytes"] for e in incoming.values()) <= BASE_LIMIT
                and len(incoming) <= FILE_LIMIT,
                "base plus well-known exceeds budget",
            )
            stable_before = {
                p: e
                for p, e in previous["base_files"].items()
                if is_asset(p) and not is_hashed(p)
            }
            stable_after = {
                p: e for p, e in incoming.items() if is_asset(p) and not is_hashed(p)
            }
            require(
                stable_before == stable_after, "incompatible unversioned resource set"
            )
            assets = {}
            for record in retired.values():
                for path, entry in record["assets"].items():
                    require(
                        path not in assets or assets[path] == entry,
                        "retained asset collision",
                    )
                    assets[path] = entry
            pinned = (
                self._view(state["previous"])["base_files"] if state["previous"] else {}
            )
            for record in (previous["base_files"], pinned, incoming):
                for path, entry in record.items():
                    if is_hashed(path):
                        require(
                            path not in assets or assets[path] == entry,
                            "same-path asset collision",
                        )
                        assets[path] = entry
            require(
                len(assets) <= ASSET_COUNT
                and sum(e["bytes"] for e in assets.values()) <= ASSET_LIMIT,
                "retained asset union exceeds quota",
            )
            # Two prepared immutable views: forward and rollback, both include exposed chunks.
            self._path(rollback).mkdir(mode=0o755)
            for path in previous["base_files"]:
                target = self._path(rollback) / path
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(self._path(prior) / path, target)
                os.chmod(target, 0o644)
            for name in (candidate, rollback):
                for path, entry in assets.items():
                    target = self._path(name) / path
                    if target.exists():
                        continue
                    source = self._path(candidate) / path
                    if not source.exists():
                        source = self._path(prior) / path
                    if not source.exists() and state["previous"]:
                        source = self._path(state["previous"]) / path
                    require(source.is_file(), "promised asset is unavailable")
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(source, target)
                    os.chmod(target, 0o644)
                files = inventory(
                    self._path(name),
                    limit=BASE_LIMIT + ASSET_LIMIT,
                    count=FILE_LIMIT + ASSET_COUNT,
                )
                dependencies = {
                    p: refs
                    for p, refs in {
                        **previous["dependencies"],
                        **envelope["payload"]["dependencies"],
                    }.items()
                    if p in files
                }
                validate_site(self._path(name), files, csp, dependencies)
                self._make_record(
                    name,
                    identity if name == candidate else previous["identity"],
                    files,
                    csp,
                    incoming if name == candidate else previous["base_files"],
                    dependencies,
                )
            self._budget()
            state["pending"] = {
                "id": generation,
                "candidate": candidate,
                "rollback": rollback,
                "prior": prior,
                "expected": expected,
                "phase": "prepared",
                "deadline": None,
                "retired": retired,
            }
            state["highwater"] = rank
            self._save(state, "prepared")
            return self.status()

    def activate(self, generation: str, *, expected: str, fresh_master: str):
        with locked(self.lock_path):
            state = self._load()
            pending = state["pending"]
            require(
                pending is not None and pending["id"] == generation,
                "transaction is not pending",
            )
            require(
                pending["phase"] == "prepared",
                "activation already attempted; reconcile instead",
            )
            require(
                expected == pending["expected"] and self._actual() == expected,
                "activation CAS failed",
            )
            candidate = self._verify(pending["candidate"])
            require(
                candidate["identity"]["source_sha"] == fresh_master,
                "master changed before activation",
            )
            self._verify(pending["rollback"])
            self._budget()
            self._guard_window(pending, ACCEPT_SECONDS, ACCEPT_SECONDS + 60)
            pending["phase"] = "armed"
            self._save(state, "armed")
            self.guard.arm(self.root, generation)
            self.checkpoint("after_guard")
            if not self.html.is_symlink():
                require(
                    self._real_identity() == pending["prior"],
                    "bootstrap changed before migration",
                )
                swap = self.root / (".release-swap-" + generation)
                require(
                    not swap.exists() and not swap.is_symlink(),
                    "unexpected migration swap",
                )
                swap.symlink_to(
                    os.path.relpath(self._path(pending["prior"]), self.root)
                )
                fsync_dir(self.root)
                original = self.html.stat()
                state["migration"] = {
                    "swap": swap.name,
                    "prior": pending["prior"],
                    "device": original.st_dev,
                    "inode": original.st_ino,
                }
                pending["phase"] = "migrating"
                self._save(state, "migration_journal")
                self.checkpoint("before_exchange")
                exchange(self.html, swap)
                self.checkpoint("after_exchange")
                pending["phase"] = "migrated"
                self._save(state, "migrated")
            pending["phase"] = "activating"
            self._save(state, "activation_journal")
            self.checkpoint("before_pointer")
            point(self.html, self._path(pending["candidate"]))
            self.checkpoint("after_pointer")
            pending["phase"] = "active"
            self._save(state, "active")
            return self.status()

    def accept(self, generation: str, evidence: dict):
        with locked(self.lock_path):
            state = self._load()
            if state["pending"] is None:
                require(
                    state["last"] is not None
                    and state["last"]["id"] == generation
                    and state["last"]["outcome"] == "accepted",
                    "late acceptance rejected",
                )
                return self.status()
            pending = state["pending"]
            require(
                pending["id"] == generation and pending["phase"] == "active",
                "wrong acceptance generation",
            )
            require(self.clock() < pending["deadline"], "acceptance deadline expired")
            require(self._actual() == pending["candidate"], "candidate is not serving")
            record = self._verify(pending["candidate"])
            require(
                evidence
                == {"identity": record["identity"], "origin": True, "browser": True},
                "origin/browser acceptance failed",
            )
            for name in (state["accepted"], state["previous"], pending["prior"]):
                if name and name not in (pending["candidate"], pending["rollback"]):
                    state["expired_views"][name] = self.clock()
            state["previous"] = pending["rollback"]
            state["accepted"] = pending["candidate"]
            state["retired"] = pending["retired"]
            state["last"] = {
                "id": generation,
                "outcome": "accepted",
                "phase": "accepted",
            }
            state["pending"] = None
            self._save(state, "accepted")
            self.guard.cancel(self.root, generation)
        return self.status()

    def recover(
        self,
        generation: str,
        *,
        target: str | None = None,
        cancel_guard=True,
        recovery_deadline=None,
        expected_receipt=None,
    ):
        with locked(self.lock_path, deadline=recovery_deadline):
            state = self._load()
            pending = state["pending"]
            if expected_receipt is not None and (
                pending is None or guard_receipt(pending) != expected_receipt
            ):
                return self.status()
            if pending is None:
                if (
                    state["last"]
                    and state["last"]["id"] == generation
                    and state["last"]["outcome"] == "failed"
                ):
                    return self.status()
                require(
                    target is not None and target == state["previous"],
                    "explicit retained rollback target required",
                )
                require(
                    state["accepted"] is not None
                    and self._view(state["accepted"])["identity"]["build_id"]
                    == generation,
                    "stale rollback generation",
                )
                self._budget(
                    additional_bytes=BASE_LIMIT + ASSET_LIMIT + 32 * MIB,
                    additional_inodes=8000,
                )
                current = self._verify(state["accepted"])
                original = self._verify(target)
                refreshed = (
                    "explicit-"
                    + digest(
                        canonical(
                            {
                                "target": target,
                                "from": state["accepted"],
                                "files": current["files"],
                            }
                        )
                    )[:32]
                )
                if self._metadata(refreshed).exists():
                    self._verify(refreshed)
                else:
                    intent_path = self.private / (refreshed + ".intent.json")
                    intent = {
                        "view": refreshed,
                        "from": state["accepted"],
                        "target": target,
                    }
                    if intent_path.exists():
                        require(
                            load_json(intent_path) == intent,
                            "explicit staging intent changed",
                        )
                        if self._path(refreshed).exists():
                            require(
                                not self._path(refreshed).is_symlink(),
                                "linked explicit staging",
                            )
                            shutil.rmtree(self._path(refreshed))
                    else:
                        require(
                            not self._path(refreshed).exists(),
                            "unowned explicit staging",
                        )
                        durable_json(intent_path, intent)
                    self.checkpoint("before_explicit_copy")
                    self._path(refreshed).mkdir(mode=0o755)
                    union = {p: e for p, e in current["files"].items() if is_hashed(p)}
                    for path, entry in original["base_files"].items():
                        require(
                            path not in union or union[path] == entry,
                            "explicit rollback asset collision",
                        )
                    require(
                        len(union) <= ASSET_COUNT
                        and sum(e["bytes"] for e in union.values()) <= ASSET_LIMIT,
                        "explicit rollback union exceeds quota",
                    )
                    files = {**original["base_files"], **union}
                    all_assets = {p: e for p, e in files.items() if is_hashed(p)}
                    require(
                        len(all_assets) <= ASSET_COUNT
                        and sum(e["bytes"] for e in all_assets.values()) <= ASSET_LIMIT,
                        "explicit rollback union exceeds quota",
                    )
                    for path in files:
                        source = (
                            self._path(state["accepted"] if path in union else target)
                            / path
                        )
                        destination = self._path(refreshed) / path
                        destination.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copyfile(source, destination)
                        os.chmod(destination, 0o644)
                        self.checkpoint("during_explicit_copy")
                    dependencies = {
                        p: refs
                        for p, refs in {
                            **original["dependencies"],
                            **current["dependencies"],
                        }.items()
                        if p in files
                    }
                    validate_site(
                        self._path(refreshed), files, set(current["csp"]), dependencies
                    )
                    self._make_record(
                        refreshed,
                        original["identity"],
                        files,
                        set(current["csp"]),
                        original["base_files"],
                        dependencies,
                    )
                    self.checkpoint("after_explicit_copy")
                (self.private / (refreshed + ".intent.json")).unlink(missing_ok=True)
                self._budget()
                pending = {
                    "id": generation,
                    "candidate": state["accepted"],
                    "rollback": refreshed,
                    "prior": target,
                    "phase": "explicit_prepared",
                    "explicit": True,
                    "retired": state["retired"],
                }
                self._guard_window(pending, 30, 60)
                state["pending"] = pending
                state["previous"] = state["accepted"]
                self._save(state, "explicit_prepared")
            require(pending["id"] == generation, "stale recovery generation")
            actual = self._actual()
            require(
                actual in {pending["prior"], pending["candidate"], pending["rollback"]},
                "unrecognized serving state; no blind recovery",
            )
            self._verify(pending["rollback"])
            if pending.get("explicit") and cancel_guard:
                if pending["phase"] == "explicit_prepared":
                    require(
                        actual == pending["candidate"],
                        "pre-arm rollback pointer already changed",
                    )
                    self._guard_window(pending, 30, 60)
                    self._save(state, "explicit_prepared")
                self.guard.arm(self.root, generation)
                pending["phase"] = "explicit_armed"
                self._save(state, "explicit_armed")
            pending["phase"] = "recovering"
            self._save(state, "recovery_journal")
            if self.html.is_symlink():
                point(self.html, self._path(pending["rollback"]))
                self.checkpoint("after_recovery_pointer")
                state["accepted"] = pending["rollback"]
                state["expired_views"][pending["candidate"]] = self.clock()
                if pending["prior"] != state["previous"]:
                    state["expired_views"][pending["prior"]] = self.clock()
            else:
                require(
                    self._real_identity() == pending["prior"],
                    "original directory changed",
                )
            state["retired"] = pending["retired"]
            if self.html.is_symlink():
                incoming = self._view(pending["candidate"])
                state["retired"][incoming["identity"]["build_id"]] = {
                    "at": self.clock(),
                    "assets": {
                        p: e for p, e in incoming["base_files"].items() if is_hashed(p)
                    },
                }
            state["last"] = {
                "id": generation,
                "outcome": "failed",
                "phase": "recovered",
            }
            state["pending"] = None
            self._save(state, "recovered")
            if cancel_guard:
                self.guard.cancel(self.root, generation)
        return self.status()

    def cleanup(self):
        with locked(self.lock_path):
            state = self._load()
            require(
                state["pending"] is None and state["accepted"] is not None,
                "cleanup requires resolved acceptance",
            )
            self._verify(state["accepted"])
            protected = {state["accepted"], state["previous"]}
            errors = 0
            for path in self.views.iterdir():
                if path.name in protected:
                    continue
                require(
                    not path.is_symlink() and path.is_dir(), "unowned cleanup entry"
                )
                metadata = self._metadata(path.name)
                # Completed unpinned HTML views expire when superseded; asset promise is separate.
                expires = state["expired_views"].get(
                    path.name, path.stat().st_mtime + 86400
                )
                if expires > self.clock():
                    continue
                try:
                    shutil.rmtree(path)
                    metadata.unlink(missing_ok=True)
                    state["expired_views"].pop(path.name, None)
                except OSError:
                    errors += 1
            migration = state["migration"]
            if migration and state["last"] and state["last"]["outcome"] == "accepted":
                swap = self.root / migration["swap"]
                require(
                    swap.parent == self.root and swap.name.startswith(".release-swap-"),
                    "unowned migration copy",
                )
                try:
                    if swap.is_symlink():
                        require(
                            swap.resolve() == self._path(migration["prior"]),
                            "migration link changed",
                        )
                        swap.unlink()
                    elif swap.is_dir():
                        require(
                            (swap.stat().st_dev, swap.stat().st_ino)
                            == (migration["device"], migration["inode"]),
                            "migration copy changed",
                        )
                        shutil.rmtree(swap)
                    state["migration"] = None
                except OSError:
                    errors += 1
            state["retired"] = self._retired(state)
            state["cleanup"] = "failed" if errors else "passed"
            self._save(state, "cleanup")
            require(not errors, "cleanup failed; serving and recovery state retained")
            return self.status()

    def guard_loop(self, generation: str):
        state = self._load()
        pending = state["pending"]
        require(
            pending is not None and pending["id"] == generation,
            "guard has no transaction",
        )
        deadline = time.monotonic() + max(0, pending["deadline"] - self.clock())
        ready = self.private / f"{generation}.ready"
        receipt = guard_receipt(pending)
        durable_json(ready, receipt)
        try:
            while time.monotonic() < deadline:
                state = self._load()
                if (
                    state["pending"] is None
                    or guard_receipt(state["pending"]) != receipt
                ):
                    return
                time.sleep(0.1)
            recovery_deadline = (
                time.monotonic() + max(0, pending["recover_by"] - self.clock())
                if pending.get("explicit")
                else deadline + 60
            )
            current = self._load()["pending"]
            if current is None or guard_receipt(current) != receipt:
                return
            self.guard.kill_worker(self.root, generation, pending["worker_key"])
            while True:
                try:
                    self.recover(
                        generation,
                        cancel_guard=False,
                        recovery_deadline=recovery_deadline,
                        expected_receipt=receipt,
                    )
                    break
                except ReleaseError as exc:
                    if (
                        str(exc) != "release lock timed out"
                        or time.monotonic() >= recovery_deadline
                    ):
                        raise
        finally:
            if ready.exists() and load_json(ready) == receipt:
                ready.unlink(missing_ok=True)
