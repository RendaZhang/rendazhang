import fs from 'fs';
import { spawnSync, execSync } from 'child_process';
import path from 'path';
import { updateFiles } from './update_last_updated.ts';
import { fileURLToPath } from 'url';
import logger from '../src/utils/logger';

/**
 * Script that updates documentation files.
 *
 * The script performs the following high-level workflow:
 * 1. Acquire a lock to prevent concurrent runs.
 * 2. Detect which of the provided files are actually modified in git.
 * 3. Run `doctoc` on the modified set to refresh table of contents.
 * 4. Update "Last updated" timestamps in those files.
 * 5. Stage the resulting changes.
 */

/**
 * Log a message with a timestamp for easier debugging.
 */
function log(msg: string) {
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').split('.')[0];
  logger.log(`[${timestamp}] ${msg}`);
}

// Repository root directory
const root = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
// Path to a lock file inside .git used to serialize script execution
const lockfile = path.join(root, '.git', 'update-docs.lock');
let lockFd: number | null = null;

/**
 * Block the event loop for the specified milliseconds.
 *
 * Used when waiting for a lock file to be released.
 */
function sleep(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Try to create the lock file, retrying for up to 10 seconds.
 */
function acquireLock() {
  log('Acquiring lock...');
  const start = Date.now();
  while (true) {
    try {
      lockFd = fs.openSync(lockfile, 'wx');
      break;
    } catch (e: any) {
      if (e.code !== 'EEXIST') {
        log(`ERROR: ${e.message}`);
        process.exit(1);
      }
      if (Date.now() - start > 10000) {
        log('ERROR: Failed to acquire lock after 10 seconds');
        process.exit(1);
      }
      // Another process holds the lock; wait a bit then retry.
      sleep(100);
    }
  }
  log('Lock acquired');
}

/**
 * Remove the lock file and close its descriptor if present.
 */
function cleanup() {
  if (lockFd !== null) {
    fs.closeSync(lockFd);
    lockFd = null;
  }
  try {
    fs.unlinkSync(lockfile);
  } catch {}
  log('Lock released and cleaned up');
}

// Clean up the lock file on termination signals
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

/**
 * Determine if a file is considered modified.
 *
 * The file is marked as modified if it is untracked, or differs from HEAD
 * either in the working tree or the staging area.
 */
function isFileModified(file: string): boolean {
  const relPath = path.relative(root, path.resolve(file));

  // 使用 git status --porcelain 获取文件状态
  const status = spawnSync('git', ['status', '--porcelain', relPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  });

  if (status.stdout) {
    const statusCode = status.stdout.slice(0, 2);
    // A  = new file in staging area
    // ?? = untracked file
    // MM = modified in both staging and working area
    // M  = modified file in staging area
    //  M = modified in working area
    // AM = new file in staging area and modified in working area

    if (statusCode === 'A ') {
      log(`New file in Staging Area: ${relPath}`);
      return true;
    } else if (statusCode === '??') {
      log(`New untracked file (in Working Area): ${relPath}`);
      return true;
    } else if (statusCode === 'MM') {
      log(`Modified file in both Staging and Working Area: ${relPath}`);
      return true;
    } else if (statusCode === 'M ') {
      log(`Modified file in Staging Area: ${relPath}`);
      return true;
    } else if (statusCode === ' M') {
      log(`Modified file in Working Area: ${relPath}`);
      return true;
    } else if (statusCode === 'AM') {
      log(`New file in Staging Area and modified in Working Area: ${relPath}`);
      return true;
    }
  }

  // 如果没有状态输出，说明文件未修改
  log(`Unchanged file: ${relPath}`);
  return false;
}

/**
 * Locate the `doctoc` executable if available.
 *
 * We support two installation methods:
 * 1. `doctoc` is already in the current `PATH`.
 * 2. `doctoc` was installed globally via `npm install -g doctoc`,
 *    but the global npm bin directory isn't on `PATH`.
 *
 * Determine how to invoke doctoc. We first try to execute the binary
 * directly. This works when doctoc is installed via package managers
 * like Homebrew or apt and is already available in the PATH.
 *
 * If that fails, fall back to `npx --no-install doctoc` which resolves
 * globally installed npm packages even when the global npm bin folder
 * isn't added to the PATH. The `--no-install` flag ensures npx will
 * simply fail instead of attempting to download doctoc from the
 * network when it's not installed at all.
 */
function resolveDoctocCommand(): string[] | null {
  let doctocCmd: string[] | null = null;
  // First try to execute `doctoc` directly from PATH
  const doctocCheck = spawnSync('doctoc', [], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'] // 仅捕获 stdout 和 stderr
  });
  if (doctocCheck.error) {
    log('SKIP: doctoc not installed (command not found)');
  } else if (doctocCheck.status === null) {
    log('SKIP: doctoc not installed (unknown error)');
  } else {
    const output = doctocCheck.stdout + doctocCheck.stderr;
    if (doctocCheck.status === 0 || output.includes("Usage: doctoc")) {
      doctocCmd = ['doctoc'];
      return doctocCmd;
    }
  }
  // If not found, attempt to locate a global installation of npm package
  log('WARN: doctoc is not found in the PATH.');
  log('INFO: Continue to locate a global installation of npm package of doctoc...')
  const doctocNpxCheck = spawnSync('npx', ['--no-install', 'doctoc', '--version'], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  if (doctocNpxCheck.error) {
    log('SKIP: npx doctoc not installed (command not found)');
  } else if (doctocNpxCheck.status === null) {
    log('SKIP: npx doctoc not installed (unknown error)');
  } else {
    const output = doctocNpxCheck.stdout + doctocNpxCheck.stderr;
    if (doctocNpxCheck.status === 0 || output.includes("Usage: doctoc")) {
      doctocCmd = ['npx', '--no-install', 'doctoc'];
      return doctocCmd;
    }
  }

  log('SKIP: doctoc is not found in this environment');
  return null;
}

/**
 * Main workflow for doc updates.
 *
 * Accepts a list of file paths and only processes those that are
 * considered modified by {@link isFileModified}.
 */
async function main() {
  acquireLock();
  process.chdir(root);
  const files = process.argv.slice(2);
  if (files.length === 0) {
    log('No files to process, exiting');
    return;
  }
  log(`Processing ${files.length} files: ${files.join(' ')}`);
  const modifiedFiles: string[] = [];
  for (const file of files) {
    if (isFileModified(file)) {
      modifiedFiles.push(file);
    }
  }
  if (modifiedFiles.length === 0) {
    log('No modified files to process, exiting');
    return;
  }
  log(`Found ${modifiedFiles.length} modified files: ${modifiedFiles.join(' ')}`);

  // Discover how to invoke doctoc. This supports both standard PATH
  // resolution and globally installed npm packages.
  const doctocCmd = resolveDoctocCommand();

  if (doctocCmd) {
    log('Running doctoc on modified files...');
    const res = spawnSync(doctocCmd[0], [...doctocCmd.slice(1), ...modifiedFiles], {
      stdio: 'inherit'
    });
    if (res.status !== 0) {
      log('WARNING: doctoc encountered issues but continuing anyway');
    }
  } else {
    log('SKIP: doctoc not installed or not in PATH');
  }
  log("Updating 'Last updated' timestamps on modified files...");
  try {
    const errors = await updateFiles(modifiedFiles);
    if (errors > 0) {
      log('WARNING: Failed to update some timestamps but continuing anyway');
    }
  } catch {
    log('WARNING: Failed to update some timestamps but continuing anyway');
  }
  if (modifiedFiles.length > 0) {
    log(`Staging changes for ${modifiedFiles.length} files: ${modifiedFiles.join(' ')}`);
    const addRes = spawnSync('git', ['add', ...modifiedFiles], { stdio: 'ignore' });
    if (addRes.status !== 0) {
      log('ERROR: Failed to stage changes');
      process.exit(1);
    }
  } else {
    log('No changes to stage after processing');
  }
  log('Update completed successfully');
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] === scriptPath) {
  main().finally(cleanup);
}
