import { defineConfig, devices } from '@playwright/test';

import 'dotenv/config';
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const frontendNodeImage = process.env.FRONTEND_NODE_IMAGE ?? 'node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : 'html',
  webServer: process.env.CI && process.env.SKIP_WEBSERVER !== 'true'
    ? {
        cwd: './frontend',
        command:
          `docker run --rm --name petclinic-frontend -p 4200:4200 -v "$PWD:/app" -w /app -e NG_CLI_ANALYTICS=false ${frontendNodeImage} npm start -- --host 0.0.0.0 --port 4200 --live-reload=false`,
        url: 'http://localhost:4200/',
        timeout: 120_000,
        reuseExistingServer: false,
        gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,

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
      testIgnore: ["**/mobile/**", "**/api/**"]
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ["**/mobile/**", "**/api/**"]
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ["**/mobile/**", "**/api/**"]
    },

    {
      name: 'mobile-chromium',
      testMatch: '**/mobile/**/*.spec.ts',
      use: { ...devices['Pixel 7'] },
    },

    {
      name: 'api',
      testMatch: "tests/api/**"
    },


  ],

});
