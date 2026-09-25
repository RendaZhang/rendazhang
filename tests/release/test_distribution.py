import os
import socketserver
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.request import urlopen

from support import artifact
from release_distribution import api, publish
from release_engine.protocol import ReleaseError
from release_engine.system import durable_json
from release_process import run


class DistributionTests(unittest.TestCase):
    def test_actual_api_deadline_bounds_slow_drip_response(self):
        class Slow(socketserver.BaseRequestHandler):
            def handle(inner):
                inner.request.recv(8192)
                try:
                    inner.request.sendall(
                        b"HTTP/1.1 200 OK\r\nContent-Length: 30\r\n\r\n"
                    )
                    for byte in b'{"ok":true}                   ':
                        time.sleep(0.4)
                        inner.request.sendall(bytes([byte]))
                except OSError:
                    pass

        with socketserver.ThreadingTCPServer(("127.0.0.1", 0), Slow) as server:
            thread = threading.Thread(target=server.serve_forever)
            thread.start()
            try:

                def loopback(_request, **kwargs):
                    return urlopen(
                        f"http://127.0.0.1:{server.server_address[1]}", **kwargs
                    )

                started = time.monotonic()
                with patch.dict(os.environ, GH_TOKEN="fixture-not-a-secret"), patch(
                    "release_distribution.urlopen", side_effect=loopback
                ), self.assertRaisesRegex(ReleaseError, "deadline"):
                    api("fixture/repo", "fixture")
                elapsed = time.monotonic() - started
                self.assertGreater(elapsed, 9.5)
                self.assertLess(elapsed, 10.8)
            finally:
                server.shutdown()
                thread.join(timeout=5)

    def test_expired_read_must_recheck_lease_before_tag_mutation(self):
        with tempfile.TemporaryDirectory(prefix="release-publish-") as tmp:
            root = Path(tmp)
            _, _, identity = artifact(root)
            durable_json(root / "identity.json", identity)
            preview = root / "preview"
            preview.mkdir()
            (preview / "index.html").write_text("public fixture")
            stale = False
            mutations = []

            def guard():
                if stale:
                    raise ReleaseError("stale publication fixture")

            def fake_api(_repo, path, **kwargs):
                nonlocal stale
                if kwargs.get("method", "GET") != "GET":
                    mutations.append(path)
                if path.startswith("git/ref/tags/"):
                    stale = True
                    return {"object": {"sha": "b" * 40}}
                return None

            def git(command, **_kwargs):
                output = (
                    "a" * 40
                    if "commit-tree" in command or "write-tree" in command
                    else ""
                )
                return subprocess.CompletedProcess(command, 0, output, "")

            with patch.dict(os.environ, GH_TOKEN="fixture-not-a-secret"), patch(
                "release_distribution.api", side_effect=fake_api
            ), patch(
                "release_distribution.run_process", side_effect=git
            ), self.assertRaisesRegex(
                ReleaseError, "stale publication"
            ):
                publish("fixture/repo", "v1", root, preview, guard)
            self.assertEqual(mutations, [])

    def test_stopped_subprocess_group_is_killed_at_absolute_timeout(self):
        started = time.monotonic()
        with self.assertRaises(subprocess.TimeoutExpired):
            run(
                [
                    sys.executable,
                    "-c",
                    "import os,signal; os.kill(os.getpid(), signal.SIGSTOP)",
                ],
                timeout=0.2,
            )
        self.assertLess(time.monotonic() - started, 2)


if __name__ == "__main__":
    unittest.main()
