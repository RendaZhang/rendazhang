"""Bounded, uncached HTTP byte/identity checks. No deployment or browser side effects."""

from __future__ import annotations

import hashlib
import http.client
import json
import socket
import signal
import threading
import time
from contextlib import contextmanager
from pathlib import PurePosixPath
from urllib.parse import quote, urlsplit
from urllib.request import parse_http_list

from .protocol import ReleaseError, canonical, require

CORE_ROUTES = {
    "index.html": "/",
    "docs/index.html": "/docs/",
    "certifications/index.html": "/certifications/",
    "deepseek_chat/index.html": "/deepseek_chat/",
    "llms.txt": "/llms.txt",
    "sitemap.xml": "/sitemap.xml",
}


def origin_url(value: str):
    parsed = urlsplit(value)
    require(
        parsed.scheme in ("https", "http")
        and parsed.hostname is not None
        and not parsed.username
        and not parsed.password
        and parsed.path in ("", "/")
        and not parsed.query
        and not parsed.fragment,
        "an explicit origin without credentials/path/query is required",
    )
    require(
        parsed.scheme == "https"
        or parsed.hostname in ("127.0.0.1", "localhost", "::1"),
        "cleartext origin is restricted to isolated loopback fixtures",
    )
    return parsed


@contextmanager
def absolute_deadline(deadline):
    require(
        threading.current_thread() is threading.main_thread(),
        "origin checks require a bounded main process",
    )
    started = time.monotonic()
    remaining = deadline - started
    require(remaining > 0, "origin verification deadline exceeded")
    handler = signal.getsignal(signal.SIGALRM)
    timer = signal.getitimer(signal.ITIMER_REAL)

    def expired(_number, _frame):
        raise ReleaseError("origin verification deadline exceeded")

    signal.signal(signal.SIGALRM, expired)
    signal.setitimer(
        signal.ITIMER_REAL, min(remaining, timer[0]) if timer[0] else remaining
    )
    try:
        yield
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        signal.signal(signal.SIGALRM, handler)
        if timer[0]:
            signal.setitimer(
                signal.ITIMER_REAL,
                max(0.000001, timer[0] - (time.monotonic() - started)),
                timer[1],
            )


def checked_headers(pairs):
    headers = {}
    checked = {
        "content-security-policy",
        "x-frame-options",
        "x-content-type-options",
        "content-type",
        "content-encoding",
        "cache-control",
    }
    for key, value in pairs:
        key = key.lower()
        require(
            key not in checked or key not in headers,
            "ambiguous origin security/representation headers",
        )
        headers[key] = value
    return headers


def headers_match(headers: dict, policy: dict):
    require(
        headers.get("content-security-policy", "").strip() == policy["csp"],
        "origin CSP mismatch",
    )
    require(
        headers.get("x-frame-options", "").upper() == "SAMEORIGIN",
        "origin frame policy mismatch",
    )
    require(
        headers.get("x-content-type-options", "").lower() == "nosniff",
        "origin MIME policy mismatch",
    )
    require(
        headers.get("content-encoding", "identity").strip().lower() == "identity",
        "origin byte encoding mismatch",
    )


def representation(headers, path):
    types = {
        ".html": {"text/html"},
        ".json": {"application/json"},
        ".xml": {"application/xml", "text/xml"},
        ".txt": {"text/plain"},
        ".js": {"text/javascript", "application/javascript"},
        ".mjs": {"text/javascript", "application/javascript"},
        ".css": {"text/css"},
        ".woff": {"font/woff", "application/font-woff"},
        ".woff2": {"font/woff2"},
        ".png": {"image/png"},
        ".webp": {"image/webp"},
        ".svg": {"image/svg+xml"},
    }
    require(
        headers.get("content-type", "").split(";", 1)[0].strip().lower()
        in types[PurePosixPath(path).suffix],
        "origin MIME representation mismatch",
    )


def revalidated(headers):
    # A directive name or field-qualified no-cache is not the unqualified directive.
    require(
        any(
            part.strip().lower() == "no-cache"
            for part in parse_http_list(headers.get("cache-control", ""))
        ),
        "release identity must be revalidated",
    )


def request(
    origin: str, path: str, deadline: float, *, loopback=False, limit=4 * 1024 * 1024
):
    target = origin_url(origin)
    remaining = deadline - time.monotonic()
    require(remaining > 0, "origin verification deadline exceeded")
    cls = (
        http.client.HTTPSConnection
        if target.scheme == "https"
        else http.client.HTTPConnection
    )
    connection = cls(target.hostname, target.port, timeout=min(5, remaining))
    if loopback:
        # Connect locally while retaining the public Host and TLS certificate/SNI validation.
        connection._create_connection = (
            lambda address, timeout, *args: socket.create_connection(
                ("127.0.0.1", address[1]), timeout
            )
        )
    with absolute_deadline(deadline):
        return _request(connection, path, deadline, limit)


def _request(connection, path, deadline, limit):
    try:
        nonce = str(time.monotonic_ns())
        connection.request(
            "GET",
            path + "?release_check=" + nonce,
            headers={
                "Cache-Control": "no-cache, no-store",
                "Pragma": "no-cache",
                "Accept-Encoding": "identity",
            },
        )
        response = connection.getresponse()
        headers = checked_headers(response.getheaders())
        sha = hashlib.sha256()
        size = 0
        small_body = bytearray()
        while True:
            require(
                time.monotonic() < deadline, "origin verification deadline exceeded"
            )
            block = response.read(65536)
            if not block:
                break
            size += len(block)
            require(size <= limit, "origin response exceeds limit")
            sha.update(block)
            if size <= 8192:
                small_body.extend(block)
        return response.status, headers, size, sha.hexdigest(), bytes(small_body)
    except (OSError, http.client.HTTPException) as exc:
        raise ReleaseError("origin HTTP verification failed") from exc
    finally:
        connection.close()


def check_origin(
    origin: str,
    identity: dict,
    files: dict,
    policy: dict,
    deadline: float,
    *,
    loopback=False,
    identity_required=True,
):
    origin_url(origin)
    status, headers, _, _, body = request(
        origin, "/release-identity.json", deadline, loopback=loopback, limit=8192
    )
    if identity_required:
        require(status == 200, "origin release identity unavailable")
        headers_match(headers, policy)
        representation(headers, "release-identity.json")
        revalidated(headers)
        try:
            actual = json.loads(body)
        except ValueError as exc:
            raise ReleaseError("origin release identity is invalid") from exc
        require(
            canonical(actual) == canonical(identity), "origin release identity mismatch"
        )
    else:
        require(
            status == 404, "unmigrated origin unexpectedly exposes a release identity"
        )
    selected = {path: route for path, route in CORE_ROUTES.items() if path in files}
    require(
        all(path in selected for path in list(CORE_ROUTES)[:4]),
        "core origin route missing",
    )
    for suffixes in (
        (".js", ".mjs"),
        (".css",),
        (".woff2", ".woff"),
        (".png", ".webp", ".svg"),
    ):
        asset = next((path for path in sorted(files) if path.endswith(suffixes)), None)
        if asset:
            selected[asset] = "/" + quote(asset, safe="/")
    for path, route in selected.items():
        status, headers, size, sha, _ = request(
            origin,
            route,
            deadline,
            loopback=loopback,
            limit=max(8192, files[path]["bytes"]),
        )
        require(status == 200, "core origin route/resource failed")
        headers_match(headers, policy)
        representation(headers, path)
        require(
            size == files[path]["bytes"] and sha == files[path]["sha256"],
            "origin route/resource bytes mismatch",
        )
    return {"identity": identity, "origin": True, "checked_paths": sorted(selected)}
