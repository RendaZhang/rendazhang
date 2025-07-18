#!/bin/bash
set -e

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

root="$(git rev-parse --show-toplevel)"

cd "$root" || { log "Failed to change to directory: $root"; exit 1; }

if ! command -v doctoc >/dev/null 2>&1; then
  log "SKIP: doctoc not installed"
  exit 0
fi

log "Running doctoc on README.md and docs/*.md..."
doctoc README.md docs/*.md || { log "Failed to run doctoc"; exit 1; }
