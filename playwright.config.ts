import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5178',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    reducedMotion: 'reduce',
    locale: 'zh-CN',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      testMatch: ['desktop.spec.ts', 'atlas.desktop.spec.ts', 'i18n.desktop.spec.ts'],
      use: { viewport: { width: 1440, height: 1080 } },
    },
    {
      name: 'mobile-chrome',
      testMatch: ['mobile.spec.ts', 'atlas.mobile.spec.ts', 'i18n.mobile.spec.ts'],
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5178',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
