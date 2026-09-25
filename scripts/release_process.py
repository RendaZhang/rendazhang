"""Runner subprocess groups have a wall-clock bound, including stopped child processes."""

import os
import signal
import subprocess


def run(command, *, timeout, check=False, input=None, stdin=None, env=None, text=False):
    process = subprocess.Popen(
        command,
        stdin=(
            subprocess.PIPE
            if input is not None
            else (stdin if stdin is not None else subprocess.DEVNULL)
        ),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        text=text,
        start_new_session=True,
    )
    try:
        stdout, stderr = process.communicate(input=input, timeout=timeout)
    except BaseException:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        process.communicate(timeout=5)
        raise
    # A successful group leader may not leave background publication work behind.
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    result = subprocess.CompletedProcess(command, process.returncode, stdout, stderr)
    if check:
        result.check_returncode()
    return result
