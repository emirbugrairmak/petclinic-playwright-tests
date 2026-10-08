import { defineConfig, devices } from '@playwright/test';

import 'dotenv/config';
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  webServer: process.env.CI && process.env.SKIP_WEBSERVER !== 'true'
    ? {
        cwd: './frontend',
        command:
          'docker run --rm --name petclinic-frontend -p 4200:4200 -v "$PWD:/app" -w /app -e NG_CLI_ANALYTICS=false node:18 npm start -- --host 0.0.0.0 --port 4200',
        url: 'http://localhost:4200/',
        timeout: 120_000,
        reuseExistingServer: false,
        gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/mobile/**'
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: '**/mobile/**'
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/mobile/**'
    },

    {
      name: 'mobile-chromium',
      testMatch: '**/mobile/**/*.spec.ts',
      use: { ...devices['Pixel 7'] },
    },

  ],

});
