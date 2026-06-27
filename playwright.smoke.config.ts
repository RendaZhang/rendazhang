import { defineConfig, devices } from '@playwright/test';

const host = process.env.SMOKE_HOST || '127.0.0.1';
const port = process.env.SMOKE_PORT || '4321';
const baseURL = process.env.SMOKE_BASE_URL || `http://${host}:${port}`;

export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: false,
  retries: 0,
  timeout: 45_000,
  expect: {
    timeout: 15_000
  },
  reporter: [['list']],
  use: {
    baseURL,
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 900 }
      }
    }
  ],
  webServer: {
    command: `npm run preview -- --host ${host} --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
