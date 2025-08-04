#!/usr/bin/env python3
"""Update 'Last updated' timestamps in markdown files.

This script searches for lines that start with '- **最后更新**:' or
'- **Last Updated**:' and replaces the timestamp with the current
system time in the format 'Month DD, YYYY, HH:MM (UTC+HH:MM)'.

Only updates files if the timestamp has changed.
"""
from __future__ import annotations

import re
import sys
from datetime import datetime
from pathlib import Path


# Match lines like '- **Last Updated**: Month DD, YYYY, HH:MM (UTC±HH:MM)'
LINE_RE = re.compile(
    r"^(?P<prefix>- \*\*(?:最后更新|Last Updated)\*\*: )"
    r"(?P<timestamp>[A-Za-z]+ \d{1,2}, \d{4}, \d{1,2}:\d{2} \(UTC[+-]\d{1,2}:\d{2}\))$",
    flags=re.MULTILINE,
)


def format_now() -> str:
    now = datetime.now().astimezone()
    offset = now.strftime("%z")  # e.g., +0800
    tz_formatted = f"UTC{offset[:3]}:{offset[3:]}"
    return now.strftime(f"%B %d, %Y, %H:%M ({tz_formatted})")


def update_file(path: Path) -> bool:
    """Update file if timestamp has changed.
    Returns True if file was updated, False otherwise."""
    try:
        text = path.read_text(encoding="utf-8")
        if not LINE_RE.search(text):
            print(f"Skipping {path}: no timestamp found")
            return False

        timestamp = format_now()
        updated = False
        new_text = text

        for match in LINE_RE.finditer(text):
            old_timestamp = match.group("timestamp")
            if old_timestamp != timestamp:
                new_text = new_text.replace(
                    match.group(0),
                    f"{match.group('prefix')}{timestamp}"
                )
                updated = True
                print(f"Updating timestamp in {path}: {old_timestamp} -> {timestamp}")

        if updated:
            if not new_text.endswith("\n"):
                new_text += "\n"
            path.write_text(new_text, encoding="utf-8")
            return True

        print(f"Timestamp unchanged in {path}")
        return False

    except Exception as e:
        print(f"Error processing {path}: {str(e)}")
        return False


def main(files: list[str]) -> int:
    updated_count = 0
    error_count = 0
    for file in files:
        try:
            p = Path(file)
            if p.is_file() and update_file(p):
                updated_count += 1
        except Exception as e:
            print(f"Error processing {file}: {str(e)}")
            error_count += 1

    print(f"Updated timestamps in {updated_count}/{len(files)} files")
    return error_count  # 返回错误数量


if __name__ == "__main__":
    error_count = main(sys.argv[1:])
    sys.exit(error_count)  # 有错误时返回非零退出码
