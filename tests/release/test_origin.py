import functools
import http.server
import json
import signal
import socketserver
import tempfile
import threading
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from support import CSP, artifact
from release_engine.artifact import unpack
from release_engine.origin import (
    absolute_deadline,
    check_origin,
    checked_headers,
    origin_url,
    request,
)
from release_engine.protocol import ReleaseError
from release_preview import Handler


class OriginTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="release-origin-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        archive, envelope, self.identity = artifact(self.root)
        self.files = envelope["payload"]["files"]
        self.html = self.root / "html"
        unpack(archive, envelope, self.html)
        (self.html / "release-identity.json").write_text(json.dumps(self.identity))
        self.policy = {
            "csp": "default-src 'self'; script-src 'self' "
            + " ".join("'" + h + "'" for h in CSP)
            + "; frame-ancestors 'self';"
        }
        self.server = http.server.ThreadingHTTPServer(
            ("127.0.0.1", 0), functools.partial(Handler, directory=str(self.html))
        )
        self.server.policy = self.policy
        self.thread = threading.Thread(target=self.server.serve_forever)
        self.thread.start()
        self.addCleanup(self.close)
        self.url = f"http://127.0.0.1:{self.server.server_port}"

    def close(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=5)

    def check(self, **kwargs):
        return check_origin(
            self.url,
            self.identity,
            self.files,
            self.policy,
            time.monotonic() + 10,
            **kwargs,
        )

    def test_identity_and_actual_core_bytes(self):
        self.assertTrue(self.check()["origin"])
        (self.html / "index.html").write_text(
            "stale HTML despite correct identity marker"
        )
        with self.assertRaisesRegex(ReleaseError, "bytes mismatch"):
            self.check()

    def test_stale_identity_and_missing_resource(self):
        marker = self.html / "release-identity.json"
        marker.write_text(json.dumps(dict(self.identity, run_id=999)))
        with self.assertRaisesRegex(ReleaseError, "identity mismatch"):
            self.check()
        marker.write_text(json.dumps(self.identity))
        next(self.html.glob("_astro/*.js")).unlink()
        with self.assertRaisesRegex(ReleaseError, "route/resource failed"):
            self.check()

    def test_headers_and_deadline_fail_closed(self):
        self.server.policy = {"csp": "default-src *"}
        with self.assertRaisesRegex(ReleaseError, "CSP mismatch"):
            self.check()
        with self.assertRaisesRegex(ReleaseError, "deadline"):
            check_origin(
                self.url, self.identity, self.files, self.policy, time.monotonic() - 1
            )

    def test_unmigrated_recovery_still_checks_real_html(self):
        (self.html / "release-identity.json").unlink()
        self.assertTrue(self.check(identity_required=False)["origin"])
        (self.html / "docs/index.html").write_text("different")
        with self.assertRaisesRegex(ReleaseError, "bytes mismatch"):
            self.check(identity_required=False)

    def test_external_target_must_be_explicit_origin(self):
        for value in (
            "https://example.test/path",
            "http://example.test",
            "https://user:pass@example.test",
            "https://example.test?next=/",
            "https://example.test/#x",
            "relative",
        ):
            with self.subTest(value=value), self.assertRaises(ReleaseError):
                origin_url(value)
        self.assertEqual(origin_url("https://example.test").hostname, "example.test")

    def test_duplicate_checked_headers_rejected_in_both_orders(self):
        for values in (
            ("default-src 'none'; sandbox", self.policy["csp"]),
            (self.policy["csp"], "default-src 'none'; sandbox"),
        ):
            with self.subTest(values=values), self.assertRaisesRegex(
                ReleaseError, "ambiguous"
            ):
                checked_headers(
                    [
                        ("Content-Security-Policy", values[0]),
                        ("content-security-policy", values[1]),
                    ]
                )
        for header in (
            "X-Frame-Options",
            "X-Content-Type-Options",
            "Content-Type",
            "Content-Encoding",
            "Cache-Control",
        ):
            with self.subTest(header=header), self.assertRaisesRegex(
                ReleaseError, "ambiguous"
            ):
                checked_headers([(header, "a"), (header.lower(), "b")])

    def test_mime_encoding_and_cache_directives(self):
        from release_engine.origin import request as actual_request

        for header, value, error in (
            ("content-type", "application/octet-stream", "MIME representation"),
            ("content-encoding", "gzip", "byte encoding"),
            ("cache-control", "public,max-age=31536000,x-no-cache=true", "revalidated"),
            ("cache-control", 'no-cache="set-cookie"', "revalidated"),
            ("cache-control", 'x="hello,no-cache,world"', "revalidated"),
        ):

            def modified(*args, **kwargs):
                result = actual_request(*args, **kwargs)
                result[1][header] = value
                return result

            with self.subTest(value=value), patch(
                "release_engine.origin.request", side_effect=modified
            ), self.assertRaisesRegex(ReleaseError, error):
                self.check()

        def mixed_case(*args, **kwargs):
            result = actual_request(*args, **kwargs)
            result[1]["cache-control"] = "public, No-Cache, must-revalidate"
            return result

        with patch("release_engine.origin.request", side_effect=mixed_case):
            self.assertTrue(self.check()["origin"])

    def test_identity_rejects_bool_and_float_numbers(self):
        marker = self.html / "release-identity.json"
        for key in ("run_id", "attempt"):
            for value in (True, 1.0):
                marker.write_text(json.dumps(dict(self.identity, **{key: value})))
                with self.subTest(key=key, value=value), self.assertRaisesRegex(
                    ReleaseError, "identity mismatch"
                ):
                    self.check()

    def test_absolute_deadline_bounds_slow_headers_and_body(self):
        for phase in ("headers", "body"):

            class Slow(socketserver.BaseRequestHandler):
                def handle(inner):
                    inner.request.recv(8192)
                    try:
                        if phase == "body":
                            inner.request.sendall(
                                b"HTTP/1.1 200 OK\r\nContent-Length: 16\r\n\r\n"
                            )
                        else:
                            inner.request.sendall(b"HTTP/1.1 200 OK\r\nX-Slow: ")
                        for _ in range(16):
                            time.sleep(0.04)
                            inner.request.sendall(b"a")
                    except OSError:
                        pass

            with socketserver.ThreadingTCPServer(("127.0.0.1", 0), Slow) as server:
                worker = threading.Thread(target=server.serve_forever)
                worker.start()
                started = time.monotonic()
                try:
                    with self.assertRaisesRegex(ReleaseError, "deadline"):
                        request(
                            f"http://127.0.0.1:{server.server_address[1]}",
                            "/",
                            started + 0.12,
                        )
                    self.assertLess(time.monotonic() - started, 0.35)
                finally:
                    server.shutdown()
                    worker.join(timeout=2)

    def test_cumulative_deadline_and_previous_alarm_are_preserved(self):
        from release_engine.origin import request as actual_request

        calls = []

        def delayed(*args, **kwargs):
            calls.append(args[1])
            with absolute_deadline(args[2]):
                time.sleep(0.05)
                return actual_request(*args, **kwargs)

        started = time.monotonic()
        with patch(
            "release_engine.origin.request", side_effect=delayed
        ), self.assertRaisesRegex(ReleaseError, "deadline"):
            check_origin(
                self.url, self.identity, self.files, self.policy, started + 0.12
            )
        self.assertGreaterEqual(len(calls), 2)
        self.assertLess(time.monotonic() - started, 0.35)
        handler = signal.getsignal(signal.SIGALRM)
        try:
            signal.setitimer(signal.ITIMER_REAL, 2)
            with self.assertRaisesRegex(ReleaseError, "deadline"), absolute_deadline(
                time.monotonic() + 0.03
            ):
                time.sleep(0.1)
            remaining, interval = signal.getitimer(signal.ITIMER_REAL)
            self.assertGreater(remaining, 1.8)
            self.assertLess(remaining, 2)
            self.assertEqual(interval, 0)
            self.assertEqual(signal.getsignal(signal.SIGALRM), handler)
        finally:
            signal.setitimer(signal.ITIMER_REAL, 0)


if __name__ == "__main__":
    unittest.main()
