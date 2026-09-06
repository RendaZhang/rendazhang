"""Lightweight shared identity/JSON primitives; no artifact scanner or engine imports."""

import hashlib
import json
from pathlib import Path

MIB = 1024 * 1024


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
