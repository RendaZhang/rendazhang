#!/usr/bin/env bash
# ------------------------------------------------------------
# Renda Zhang Web · update-docs.sh
# 功能：在提交前自动更新文档目录并刷新 "Last updated" 信息
# Usage: bash scripts/update_docs.sh [files...]
# ------------------------------------------------------------
set -euo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

root="$(git rev-parse --show-toplevel)"
lockfile="$root/.git/update-docs.lock"
exec 9>"$lockfile"
flock 9
cd "$root" || { log "Failed to change to directory: $root"; exit 1; }

files=("$@")
(( ${#files[@]} )) || exit 0

if command -v doctoc >/dev/null 2>&1; then
  log "Running doctoc on ${files[*]}..."
  doctoc "${files[@]}" || { log "Failed to run doctoc"; exit 1; }
else
  log "SKIP: doctoc not installed"
fi

log "Updating 'Last updated' timestamps..."
python scripts/update_last_updated.py "${files[@]}"

git add "${files[@]}" || { log "ERROR: Failed to stage changes"; exit 1; }
