"""Fault injection is test-only; the production CLI has no fault/capacity bypass flags."""

import os
import signal
import sys
from pathlib import Path

from support import ROOM, SOURCE, FakeGuard
from release_engine.artifact import ReleaseError
from release_engine.engine import Engine
from release_engine.system import SystemdGuard, capacity, locked

root, label, action = sys.argv[1:4]


def checkpoint(name):
    if name == label:
        os._exit(77)
    if label == "hang" and name == "after_pointer":
        os.kill(os.getpid(), signal.SIGSTOP)
    if label == "explicit_death" and name == "after_recovery_journal":
        os.kill(os.getpid(), signal.SIGKILL)


engine = Engine(
    Path(root),
    capacity_provider=(
        capacity if label in ("hang", "death", "explicit_death") else ROOM
    ),
    guard=(
        SystemdGuard() if label in ("hang", "death", "explicit_death") else FakeGuard()
    ),
    checkpoint=checkpoint,
)
try:
    pending = engine.status()["pending"]
    if action == "hold":
        with locked(engine.lock_path):
            os.kill(os.getpid(), signal.SIGSTOP)
    elif action == "prepare":
        from release_engine.artifact import load_json
        from support import CSP

        engine.prepare(
            Path(sys.argv[4]),
            load_json(Path(sys.argv[5])),
            expected=engine.status()["serving"],
            fresh_master=SOURCE,
            csp=CSP,
        )
    elif action == "activate":
        engine.activate(
            pending["id"], expected=pending["expected"], fresh_master=SOURCE
        )
        if label == "death":
            os.kill(os.getpid(), signal.SIGKILL)
    elif action == "explicit":
        state = engine.status()
        engine.recover(state["last"]["id"], target=state["previous"])
    elif action == "accept":
        identity = engine._view(pending["candidate"])["identity"]
        engine.accept(
            pending["id"], {"identity": identity, "origin": True, "browser": True}
        )
    else:
        generation = pending["id"] if pending else engine.status()["last"]["id"]
        engine.recover(generation)
except ReleaseError:
    raise SystemExit(2)
