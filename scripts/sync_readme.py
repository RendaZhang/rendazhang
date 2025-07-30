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
assets_readme = root / "src" / "assets" / "README.md"
root_readme_en = root / "README_EN.md"
assets_readme_en = root / "src" / "assets" / "README_EN.md"


def copy_and_stage(src: pathlib.Path, dest: pathlib.Path) -> None:
    if src.exists():
        try:
            shutil.copyfile(src, dest)
            logging.info(f"Copied {src} to {dest}")
        except Exception as e:
            logging.error(f"Failed to copy file: {e}")
            sys.exit(1)
        try:
            subprocess.run(["git", "add", str(dest)], check=True)
            logging.info(f"Added {dest} to git")
        except subprocess.CalledProcessError as e:
            logging.error(f"Failed to add file to git: {e}")
            sys.exit(1)
    else:
        logging.error(f"File {src} does not exist")
        sys.exit(1)


copy_and_stage(root_readme, assets_readme)
copy_and_stage(root_readme_en, assets_readme_en)
