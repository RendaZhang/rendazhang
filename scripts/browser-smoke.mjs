import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function run(args, env = process.env) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.SMOKE_MODE === 'external') {
  if (!process.env.RELEASE_ORIGIN || !process.env.RELEASE_BUNDLE) {
    throw new Error('External smoke requires an explicit origin and immutable bundle');
  }
  run(['node_modules/@playwright/test/cli.js', 'test', '--config=playwright.acceptance.config.ts']);
} else {
  if (process.env.SMOKE_MODE || process.env.SMOKE_BASE_URL || process.env.RELEASE_ORIGIN) {
    throw new Error(
      'External targets require SMOKE_MODE=external; local smoke may not impersonate them'
    );
  }
  const manifest = JSON.parse(readFileSync('node_modules/astro/package.json', 'utf8'));
  const binary = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin.astro;
  run([join('node_modules/astro', binary), 'build'], { ...process.env, SKIP_SENTRY: 'true' });
  run(['node_modules/@playwright/test/cli.js', 'test', '--config=playwright.smoke.config.ts']);
}
