#!/usr/bin/env python3
"""Update 'Last updated' timestamps in markdown files.

This script searches for lines that start with '- **最后更新**:' or
'- **Last Updated**:' and replaces the timestamp with the current
system time in the format 'Month DD, YYYY, HH:MM (UTC+HH:MM)'.
"""
from __future__ import annotations

import re
import sys
from datetime import datetime
from pathlib import Path


# Match lines like '- **Last Updated**: Month DD, YYYY, HH:MM (UTC±HH:MM)'
LINE_RE = re.compile(
    r"^(?P<prefix>- \*\*(?:最后更新|Last Updated)\*\*: )"
    r"[A-Za-z]+ \d{2}, \d{4}, \d{2}:\d{2} \(UTC[+-]\d{2}:\d{2}\)$",
    flags=re.MULTILINE,
)


def format_now() -> str:
    now = datetime.now().astimezone()
    offset = now.strftime("%z")  # e.g., +0800
    tz_formatted = f"UTC{offset[:3]}:{offset[3:]}"
    return now.strftime(f"%B %d, %Y, %H:%M ({tz_formatted})")


def update_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if not LINE_RE.search(text):
        return
    timestamp = format_now()

    def repl(match: re.Match[str]) -> str:
        return f"{match.group('prefix')}{timestamp}"

    new_text, count = LINE_RE.subn(repl, text)
    if count:
        if not new_text.endswith("\n"):
            new_text += "\n"
        path.write_text(new_text, encoding="utf-8")


def main(files: list[str]) -> None:
    for file in files:
        p = Path(file)
        if p.is_file():
            update_file(p)


if __name__ == "__main__":
    main(sys.argv[1:])
