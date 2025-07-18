#!/usr/bin/env python3
import pathlib
import shutil
import subprocess
import sys

# Set up logging
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

root = pathlib.Path(__file__).resolve().parents[1]
root_readme = root / "README.md"
public_readme = root / "public" / "README.md"

if root_readme.exists():
    try:
        shutil.copyfile(root_readme, public_readme)
        logging.info(f"Copied {root_readme} to {public_readme}")
    except Exception as e:
        logging.error(f"Failed to copy file: {e}")
        sys.exit(1)
    try:
        subprocess.run(["git", "add", str(public_readme)], check=True)
        logging.info(f"Added {public_readme} to git")
    except subprocess.CalledProcessError as e:
        logging.error(f"Failed to add file to git: {e}")
        sys.exit(1)
else:
    logging.error(f"File {root_readme} does not exist")
    sys.exit(1)
