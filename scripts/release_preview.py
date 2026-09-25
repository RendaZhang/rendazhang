"""Isolated static HTTP fixture for a verified artifact; never a production server."""

import argparse
import functools
import http.server
import os
import json
from pathlib import Path

from release_engine.protocol import load_json


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Content-Security-Policy", self.server.policy["csp"])
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def list_directory(self, _path):
        self.send_error(404)

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--port", type=int, default=4322)
    parser.add_argument("--uid", type=int)
    args = parser.parse_args()
    policy = load_json(args.policy)
    if args.uid is not None:
        os.setgroups([])
        os.setgid(args.uid)
        os.setuid(args.uid)
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", args.port),
        functools.partial(Handler, directory=str(args.root.absolute())),
    )
    server.policy = policy
    print(json.dumps({"port": server.server_port}), flush=True)
    server.serve_forever()
