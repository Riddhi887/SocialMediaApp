const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const lockFilePath = path.join(process.cwd(), '.next', 'dev', 'lock');

function killPid(pid) {
  if (!pid || Number.isNaN(pid)) {
    return;
  }

  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    // ignore
  }

  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    // ignore
  }
}

function releaseNextLock() {
  if (!fs.existsSync(lockFilePath)) {
    return;
  }

  try {
    const raw = fs.readFileSync(lockFilePath, 'utf8').trim();
    const pid = Number.parseInt(raw, 10);
    killPid(pid);
  } catch {
    // ignore parse/read errors
  }

  try {
    fs.unlinkSync(lockFilePath);
  } catch {
    // ignore
  }
}

function freePort3000() {
  if (process.platform !== 'win32') {
    return;
  }

  const result = spawnSync('cmd.exe', ['/c', 'netstat -ano | findstr :3000'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const output = result.stdout || '';
  if (!output.trim()) {
    return;
  }

  const pids = new Set();

  output.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    const parts = trimmed.split(/\s+/);
    const pidText = parts[parts.length - 1];
    const pid = Number.parseInt(pidText, 10);

    if (!Number.isNaN(pid) && pid !== process.pid) {
      pids.add(pid);
    }
  });

  pids.forEach((pid) => {
    spawnSync('taskkill', ['/PID', String(pid), '/F'], {
      stdio: 'ignore',
    });
  });
}

releaseNextLock();
freePort3000();
