"""Synthetic public artifacts only. All writes stay in caller-owned temporary roots."""

import base64
import hashlib
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

from release_engine.artifact import REQUIRED, load_json, pack
from release_engine.engine import Engine

SOURCE = "a" * 40
SCRIPT = "document.documentElement.dataset.fixture='ready'"
CSP = {"sha256-" + base64.b64encode(hashlib.sha256(SCRIPT.encode()).digest()).decode()}
ROOM = lambda _root: (100 * 1024**3, 1000000, 1024**3)


class FakeGuard:
    def __init__(self):
        self.armed = []
        self.cancelled = []

    def arm(self, root, generation):
        self.armed.append(generation)

    def cancel(self, root, generation):
        self.cancelled.append(generation)

    def kill_worker(self, root, generation, worker_key):
        pass


def tree(path, version="one"):
    path.mkdir(parents=True)
    path.chmod(0o755)
    assets = {
        f"_astro/main.{version}12345678.js": f'import("./lazy.{version}12345678.js");'.encode(),
        f"_astro/lazy.{version}12345678.js": b"export default 1;",
        f"_astro/style.{version}12345678.css": f'body{{background:url("./image.{version}12345678.webp")}}'.encode(),
        f"_astro/image.{version}12345678.webp": b"image fixture",
        f"_astro/font.{version}12345678.woff2": b"font fixture",
        f"_astro/Resume.{version}12345678.pdf": b"public PDF fixture",
        "js/stable.js": b"window.fixture=true;",
        ".well-known/acme-challenge/fixture": b"public challenge fixture",
    }
    html = (
        f'<html><head><script>{SCRIPT}</script><script src="/js/stable.js"></script>'
        f'<link rel="stylesheet" href="/_astro/style.{version}12345678.css"></head>'
        f'<body><astro-island component-url="/_astro/main.{version}12345678.js" '
        f'renderer-url="/_astro/lazy.{version}12345678.js"></astro-island>{version}</body></html>'
    )
    for name, data in {**assets, **{p: html.encode() for p in REQUIRED}}.items():
        file = path / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_bytes(data)
        file.chmod(0o644)


def artifact(base, run=1, version="two", attempt=1):
    source = base / f"source-{run}-{attempt}"
    tree(source, version)
    archive = base / f"build-{run}-{attempt}.tar.gz"
    manifest = base / f"build-{run}-{attempt}.json"
    identity = pack(source, archive, manifest, SOURCE, run, attempt)
    return archive, load_json(manifest), identity


def representative_tree(path, version):
    """166 public fixture files, about 7.2 MiB logical; no production input or network."""
    tree(path, version)
    randomizer = random.Random(1821)
    groups = (
        (60, 32, "js"),
        (18, 8, "css"),
        (25, 100, "webp"),
        (24, 64, "woff2"),
        (26, 48, "pdf"),
    )
    for count, kib, suffix in groups:
        for number in range(count):
            data = randomizer.randbytes(kib * 1024)
            if suffix in {"js", "css"}:
                data = b"/*" + data[: len(data) // 2 - 2].hex().encode() + b"*/"
            file = path / "_astro" / f"sample-{number}.{version}12345678.{suffix}"
            file.write_bytes(data)
            file.chmod(0o644)


def fixture(base, *, guard=None, checkpoint=lambda _label: None, clock=None):
    root = base / "host"
    tree(root / "html")
    root.chmod(0o755)
    args = {
        "capacity_provider": ROOM,
        "guard": guard or FakeGuard(),
        "checkpoint": checkpoint,
    }
    if clock:
        args["clock"] = clock
    return Engine(root, **args)


def prepare(engine, archive, envelope):
    return engine.prepare(
        archive,
        envelope,
        expected=engine.status()["serving"],
        fresh_master=SOURCE,
        csp=CSP,
    )


def activate(engine, identity):
    return engine.activate(
        identity["build_id"],
        expected=engine.status()["pending"]["expected"],
        fresh_master=SOURCE,
    )


def accept(engine, identity):
    return engine.accept(
        identity["build_id"], {"identity": identity, "origin": True, "browser": True}
    )
