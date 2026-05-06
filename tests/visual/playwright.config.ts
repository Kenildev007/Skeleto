import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'retain-on-failure',
    viewport: { width: 1200, height: 900 },
  },
  webServer: {
    command: 'pnpm --filter docs-site dev',
    url: 'http://localhost:4000',
    reuseExistingServer: true,
    timeout: 120_000,
    cwd: '../..',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
