import { defineConfig } from '@playwright/test';

const target = process.env.RELEASE_ORIGIN;
if (!target || !process.env.RELEASE_BUNDLE || process.env.SMOKE_MODE !== 'external') {
  throw new Error('Acceptance requires an explicit external origin and immutable bundle');
}
const origin = new URL(target);
if (origin.origin !== target || !['http:', 'https:'].includes(origin.protocol)) {
  throw new Error('Acceptance target must be exactly one origin');
}

export default defineConfig({
  testDir: './tests/acceptance',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 85_000,
  globalTimeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  outputDir: process.env.RELEASE_BROWSER_OUTPUT || '/tmp/personalweb-acceptance',
  use: {
    baseURL: target,
    browserName: 'chromium',
    viewport: { width: 1366, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
  // Deliberately no webServer: neither preview nor build is allowed in external mode.
});
