import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E テスト設定
 *
 * テスト実行環境: ローカル開発環境（http://localhost:3000）
 * テストデータ: .env.test ファイルから読み込み
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // テスト順序を保証
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    // Base URL for all requests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Firefox / WebKit は初期セットアップでは不要
    // 将来的に全ブラウザテストが必要になった場合に有効化
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
