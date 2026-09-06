"""Canonical manifests and bounded static-artifact validation (stdlib only)."""

from __future__ import annotations

import base64
import gzip
import hashlib
import json
import os
import re
import stat
import subprocess
import tarfile
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urljoin, urlsplit

MIB = 1024 * 1024
ARCHIVE_LIMIT = 16 * MIB
BASE_LIMIT = 32 * MIB
FILE_LIMIT = 2000
ASSET_LIMIT = 128 * MIB
ASSET_COUNT = 5000
IDENTITY = "release-identity.json"
REQUIRED = (
    "index.html",
    "docs/index.html",
    "certifications/index.html",
    "deepseek_chat/index.html",
    "404.html",
)
SHA = re.compile(r"[0-9a-f]{64}\Z")
SOURCE = re.compile(r"[0-9a-f]{40}\Z")
HASHED = re.compile(r"(?:^_astro/|[._-][A-Za-z0-9_-]{8,}\.)")
RESOURCE_SUFFIXES = {
    ".js",
    ".mjs",
    ".css",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".webp",
    ".avif",
    ".ico",
    ".pdf",
}


class ReleaseError(Exception):
    """A fail-closed contract violation, safe to report without input contents."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ReleaseError(message)


def canonical(value: object) -> bytes:
    return json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False
    ).encode()


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def hash_file(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def safe_path(value: str) -> str:
    require(isinstance(value, str) and 0 < len(value) <= 240, "invalid artifact path")
    require(
        not any(ord(c) < 32 or c in "\\\x7f" for c in value), "invalid artifact path"
    )
    parts = value.split("/")
    require(
        not value.startswith("/") and all(p not in ("", ".", "..") for p in parts),
        "escaping or noncanonical artifact path",
    )
    require(
        not any(p.startswith(".") and p != ".well-known" for p in parts),
        "private artifact path",
    )
    require(value != IDENTITY and not value.endswith(".map"), "reserved artifact path")
    return value


def load_json(path: Path, limit: int = 2 * MIB) -> dict:
    require(path.is_file() and not path.is_symlink(), "missing or linked JSON")
    require(path.stat().st_size <= limit, "JSON exceeds limit")

    def pairs(items):
        result = {}
        for key, value in items:
            require(key not in result, "duplicate JSON key")
            result[key] = value
        return result

    try:
        value = json.loads(path.read_bytes(), object_pairs_hook=pairs)
    except (ValueError, UnicodeError) as exc:
        raise ReleaseError("invalid JSON") from exc
    require(isinstance(value, dict), "JSON must be an object")
    return value


def inventory(
    root: Path,
    *,
    limit: int = BASE_LIMIT,
    count: int = FILE_LIMIT,
    generated: bool = False,
) -> dict[str, dict]:
    require(root.is_dir() and not root.is_symlink(), "tree must be a real directory")
    result = {}
    size = 0
    for directory, dirs, names in os.walk(root, followlinks=False):
        for name in sorted(dirs + names):
            path = Path(directory) / name
            relative = path.relative_to(root).as_posix()
            info = path.lstat()
            require(not stat.S_ISLNK(info.st_mode), "linked tree member")
            require(not info.st_mode & 0o022, "writable-by-others tree member")
            if generated and relative == IDENTITY:
                continue
            safe_path(relative)
            if stat.S_ISDIR(info.st_mode):
                continue
            require(stat.S_ISREG(info.st_mode), "special tree member")
            size += info.st_size
            require(size <= limit and len(result) < count, "tree exceeds limits")
            require(
                stat.S_IMODE(info.st_mode) == 0o644, "static files must be mode 0644"
            )
            result[relative] = {
                "bytes": info.st_size,
                "sha256": hash_file(path),
                "mode": 0o644,
            }
    return dict(sorted(result.items()))


def validate_envelope(envelope: dict) -> dict:
    require(
        set(envelope)
        == {"payload", "payload_sha256", "archive_sha256", "archive_bytes"},
        "unknown envelope fields",
    )
    payload = envelope["payload"]
    require(
        isinstance(payload, dict)
        and set(payload)
        == {"schema", "source_sha", "run_id", "attempt", "files", "dependencies"},
        "invalid payload fields",
    )
    require(
        payload["schema"] == 1
        and isinstance(payload["source_sha"], str)
        and SOURCE.fullmatch(payload["source_sha"]),
        "invalid source identity",
    )
    for key in ("run_id", "attempt"):
        require(
            type(payload[key]) is int and 0 < payload[key] < 2**63,
            "invalid run identity",
        )
    require(
        envelope["payload_sha256"] == digest(canonical(payload)),
        "payload digest mismatch",
    )
    require(
        isinstance(envelope["archive_sha256"], str)
        and SHA.fullmatch(envelope["archive_sha256"]),
        "invalid archive identity",
    )
    require(
        type(envelope["archive_bytes"]) is int
        and 0 < envelope["archive_bytes"] <= ARCHIVE_LIMIT,
        "archive exceeds limit",
    )
    files = payload["files"]
    require(
        isinstance(files, dict) and 0 < len(files) <= FILE_LIMIT,
        "invalid file inventory",
    )
    size = 0
    for path, entry in files.items():
        safe_path(path)
        require(
            isinstance(entry, dict) and set(entry) == {"bytes", "sha256", "mode"},
            "invalid file fields",
        )
        require(
            type(entry["bytes"]) is int
            and entry["bytes"] >= 0
            and entry["mode"] == 0o644
            and isinstance(entry["sha256"], str)
            and SHA.fullmatch(entry["sha256"]),
            "invalid file identity",
        )
        size += entry["bytes"]
    require(
        size <= BASE_LIMIT and all(p in files for p in REQUIRED),
        "missing routes or oversized tree",
    )
    dependencies = payload["dependencies"]
    require(
        isinstance(dependencies, dict)
        and set(dependencies)
        == {p for p in files if PurePosixPath(p).suffix in (".js", ".mjs")},
        "incomplete module graph",
    )
    for refs in dependencies.values():
        require(
            isinstance(refs, list) and len(refs) <= FILE_LIMIT, "invalid module graph"
        )
        for ref in refs:
            require(safe_path(ref) in files, "referenced module resource missing")
    return payload


def public_identity(envelope: dict) -> dict:
    p = validate_envelope(envelope)
    return {
        "source_sha": p["source_sha"],
        "run_id": p["run_id"],
        "attempt": p["attempt"],
        "build_id": f'{p["run_id"]}-{p["attempt"]}-{envelope["payload_sha256"][:16]}',
        "payload_sha256": envelope["payload_sha256"],
        "archive_sha256": envelope["archive_sha256"],
    }


def pack(
    root: Path, archive: Path, manifest: Path, source: str, run: int, attempt: int
) -> dict:
    files = inventory(root)
    require(
        not archive.exists() and not manifest.exists(), "artifact output already exists"
    )
    with tarfile.open(archive, "x:gz", format=tarfile.USTAR_FORMAT) as tar:
        for path, entry in files.items():
            info = tarfile.TarInfo(path)
            info.size, info.mode, info.mtime = entry["bytes"], 0o644, 0
            with (root / path).open("rb") as stream:
                tar.addfile(info, stream)
    parser = Path(__file__).resolve().parents[1] / "release-dependencies.mjs"
    result = subprocess.run(
        ["node", str(parser), str(root)], capture_output=True, timeout=30, check=False
    )
    require(
        result.returncode == 0 and len(result.stdout) <= 2 * MIB,
        "runner module graph extraction failed",
    )
    dependencies = json.loads(result.stdout)
    payload = {
        "schema": 1,
        "source_sha": source,
        "run_id": run,
        "attempt": attempt,
        "files": files,
        "dependencies": dependencies,
    }
    envelope = {
        "payload": payload,
        "payload_sha256": digest(canonical(payload)),
        "archive_sha256": hash_file(archive),
        "archive_bytes": archive.stat().st_size,
    }
    validate_envelope(envelope)
    with manifest.open("xb") as stream:
        stream.write(canonical(envelope))
    return public_identity(envelope)


def unpack(archive: Path, envelope: dict, destination: Path) -> None:
    payload = validate_envelope(envelope)
    require(
        not archive.is_symlink() and archive.is_file(), "archive is not a regular file"
    )
    require(
        archive.stat().st_size == envelope["archive_bytes"]
        and hash_file(archive) == envelope["archive_sha256"],
        "archive digest/size mismatch",
    )
    destination.mkdir(mode=0o755)
    seen = set()
    decompressed = 0

    # Parse one stdlib USTAR header at a time. Never let TarFile allocate a PAX/longname body.
    # This also works with the Ubuntu 24.04 OS Python 3.12 (no 3.13 stream= keyword).
    def bounded_read(stream, amount):
        nonlocal decompressed
        require(
            amount <= 65536
            and decompressed + amount <= BASE_LIMIT + FILE_LIMIT * 1024 + 10240,
            "decompressed tar stream exceeds limit",
        )
        block = stream.read(amount)
        decompressed += len(block)
        return block

    try:
        with gzip.open(archive, "rb") as stream:
            while True:
                header = bounded_read(stream, 512)
                require(len(header) == 512, "truncated tar header")
                if header == bytes(512):
                    require(
                        bounded_read(stream, 512) == bytes(512),
                        "missing tar terminator",
                    )
                    while True:
                        padding = bounded_read(stream, 512)
                        require(not any(padding), "nonzero trailing tar data")
                        if not padding:
                            break
                    break
                member = tarfile.TarInfo.frombuf(header, "utf-8", "strict")
                path = safe_path(member.name)
                require(
                    path not in seen and len(seen) < FILE_LIMIT,
                    "duplicate/excess archive member",
                )
                seen.add(path)
                require(
                    member.isfile()
                    and not member.sparse
                    and member.mode == 0o644
                    and not member.pax_headers,
                    "linked/special/noncanonical archive member",
                )
                entry = payload["files"].get(path)
                require(
                    entry is not None and member.size == entry["bytes"],
                    "unexpected archive member",
                )
                target = destination / path
                target.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
                sha = hashlib.sha256()
                remaining = member.size
                with target.open("xb") as output:
                    os.chmod(target, 0o644)
                    while remaining:
                        block = bounded_read(stream, min(65536, remaining))
                        require(bool(block), "truncated archive body")
                        output.write(block)
                        sha.update(block)
                        remaining -= len(block)
                    output.flush()
                    os.fsync(output.fileno())
                require(sha.hexdigest() == entry["sha256"], "file digest mismatch")
                padding = (-member.size) % 512
                require(
                    bounded_read(stream, padding) == bytes(padding),
                    "invalid member padding",
                )
        require(seen == set(payload["files"]), "missing archive files")
    except (tarfile.TarError, EOFError, OSError) as exc:
        raise ReleaseError("invalid or interrupted archive") from exc


def is_asset(path: str) -> bool:
    return PurePosixPath(path).suffix.lower() in RESOURCE_SUFFIXES


def is_hashed(path: str) -> bool:
    return path.startswith("_astro/") or (is_asset(path) and bool(HASHED.search(path)))


class References(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.resources: list[str] = []
        self.scripts: list[str] = []
        self.current: str | None = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("src", "poster", "component-url", "renderer-url"):
            if key in attrs:
                self.resources.append(attrs[key])
        if tag == "link" and attrs.get("rel") in (
            "stylesheet",
            "modulepreload",
            "preload",
            "icon",
        ):
            self.resources.append(attrs.get("href", ""))
        if "srcset" in attrs:
            self.resources.extend(
                v.strip().split()[0] for v in attrs["srcset"].split(",") if v.strip()
            )
        require(
            not any(k.lower().startswith("on") for k in attrs),
            "inline event handler not allowed",
        )
        if (
            tag == "script"
            and "src" not in attrs
            and attrs.get("type") not in ("application/json", "application/ld+json")
        ):
            self.current = ""

    def handle_data(self, data):
        if self.current is not None:
            self.current += data

    def handle_endtag(self, tag):
        if tag == "script" and self.current is not None:
            if self.current.strip():
                self.scripts.append(self.current)
            self.current = None


def validate_site(
    root: Path, files: dict, csp_hashes: set[str], dependencies: dict | None = None
) -> None:
    require(all(p in files for p in REQUIRED), "required route missing")
    for refs in (dependencies or {}).values():
        require(all(ref in files for ref in refs), "referenced module resource missing")
    for path in files:
        suffix = PurePosixPath(path).suffix
        if suffix not in (".html", ".css"):
            continue
        require(
            (root / path).stat().st_size <= 4 * MIB,
            "text resource exceeds scanner memory bound",
        )
        text = (root / path).read_text(encoding="utf-8")
        refs = []
        if suffix == ".html":
            parser = References()
            parser.feed(text)
            refs = parser.resources
            for script in parser.scripts:
                value = (
                    "sha256-"
                    + base64.b64encode(
                        hashlib.sha256(script.encode()).digest()
                    ).decode()
                )
                require(value in csp_hashes, "executable inline CSP mismatch")
        else:
            # CSS files only. JavaScript strings/templates are not CSS or module syntax.
            refs = re.findall(r'url\(\s*[\'"]?([^\s)\'\"]+)', text)
        for ref in refs:
            parts = urlsplit(ref)
            if parts.scheme or parts.netloc or ref.startswith("#"):
                continue
            if not parts.path:
                continue
            resolved = unquote(urlsplit(urljoin("/" + path, ref)).path).lstrip("/")
            require(
                ".." not in PurePosixPath(resolved).parts, "escaping resource reference"
            )
            require(
                resolved in files or resolved.rstrip("/") + "/index.html" in files,
                "referenced resource missing",
            )
