#!/usr/bin/env bash
# ------------------------------------------------------------
# Renda Zhang Web · update-docs.sh
# 功能：在提交前自动更新文档目录并刷新 "Last updated" 信息
# Usage: bash scripts/update_docs.sh [files...]
# - 以状态码 0 退出脚本，pre-commit 框架会认为没有出错。
# - 以状态码 1 退出脚本，pre-commit 框架会认为发生错误。
# - 以非零状态码退出脚本，pre-commit 框架会认为发生错误。
# ------------------------------------------------------------
set -euo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 清理操作函数
cleanup() {
  # 确保锁文件被释放
  flock -u 9
  rm -f "$lockfile"
  log "Lock released and cleaned up"
}
# 确保在脚本被中断（如用户按下 Ctrl+C）或接收到终止信号时，
# 执行 cleanup 函数进行清理操作，并以状态码 0 退出脚本。
# 同时，在脚本正常退出时也会执行相同的清理操作。
trap 'cleanup; exit 0' SIGINT SIGTERM EXIT

# 获取相对于仓库根目录的路径
relpath() {
  realpath --relative-to="$root" "$1"
}

# 检查文件是否被修改
is_file_modified() {
  local file=$1
  local rel_path=$(relpath "$file")
  if ! git ls-files --error-unmatch "$rel_path" &>/dev/null; then
    # 文件是新建的，未被 GIT 跟踪
    # 一般情况下 pre-commit 框架不会传入未被追踪的文件
    log "New untracked file: $rel_path"
    return 0
  fi
  if ! git diff --quiet -- "$rel_path"; then
    if ! git diff --quiet --cached -- "$rel_path"; then
      # 文件在工作区和暂存区都有修改
      log "Modified file in both Working Area and Staging Area: $rel_path"
      return 0
    else
      # 文件只在工作区有修改
      log "Modified file in Working Area: $rel_path"
      return 0
    fi
    return 0
  fi
  if ! git diff --quiet --cached -- "$rel_path"; then
    # 文件只在暂存区有修改
    log "Modified file in Staging Area: $rel_path"
    return 0
  fi
  # 文件已经在本地仓库，没有新修改
  log "Unchanged file: $rel_path"
  return 1
}

root="$(git rev-parse --show-toplevel)"
lockfile="$root/.git/update-docs.lock"
exec 9>"$lockfile"

# 获取锁（等待最多 10 秒）
log "Acquiring lock..."
if ! flock -w 10 9; then
  log "ERROR: Failed to acquire lock after 10 seconds"
  exit 1
fi
log "Lock acquired"

cd "$root" || { log "Failed to change to directory: $root"; exit 1; }

files=("$@")
if (( ${#files[@]} == 0 )); then
  log "No files to process, exiting"
  exit 0
fi

log "Processing ${#files[@]} files: ${files[*]}"

# 过滤出已修改的文件
modified_files=()
for file in "${files[@]}"; do
  if is_file_modified "$file"; then
    modified_files+=("$file")
  fi
done

# 如果没有被修改的文件，直接退出
if (( ${#modified_files[@]} == 0 )); then
  log "No modified files to process, exiting"
  exit 0
fi

log "Found ${#modified_files[@]} modified files: ${modified_files[*]}"

# 开始执行更新文档目录和时间戳的操作
# 运行 doctoc（如果已安装）
if command -v doctoc >/dev/null 2>&1; then
  log "Running doctoc on modified files..."
  if ! doctoc "${modified_files[@]}"; then
    log "WARNING: doctoc encountered issues but continuing anyway"
  fi
else
  log "SKIP: doctoc not installed"
fi
# 更新时间戳
log "Updating 'Last updated' timestamps on modified files..."
if ! python scripts/update_last_updated.py "${modified_files[@]}"; then
  log "WARNING: Failed to update some timestamps but continuing anyway"
fi

# 将所有修改后的文件重新加入暂存区
if (( ${#modified_files[@]} > 0 )); then
  log "Staging changes for ${#modified_files[@]} files: ${modified_files[*]}"
  if ! git add "${modified_files[@]}"; then
    log "ERROR: Failed to stage changes"
    exit 1
  fi
else
  log "No changes to stage after processing"
fi

log "Update completed successfully"
exit 0
