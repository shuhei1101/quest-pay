import { Page, expect } from '@playwright/test'

/**
 * 認証関連のヘルパー関数
 */

export const auth = {
  /**
   * ログインページからログインを実行
   */
  async login(page: Page, email: string, password: string) {
    await page.goto('/login')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/home', { timeout: 10000 })
  },

  /**
   * ログアウトを実行
   */
  async logout(page: Page) {
    // サイドメニューを開く（必要に応じて）
    await page.click('[data-testid="user-menu"]')
    await page.click('text=ログアウト')
    await page.waitForURL('/login', { timeout: 10000 })
  },

  /**
   * ホーム画面が表示されているか検証
   */
  async expectHomePage(page: Page) {
    await expect(page).toHaveURL('/home')
    await expect(page.locator('text=ホーム')).toBeVisible({ timeout: 5000 })
  },
}

/**
 * UI ユーティリティ
 */
export const ui = {
  /**
   * ボタンをクリックして待機
   */
  async clickAndWait(page: Page, selector: string, options = {}) {
    await page.click(selector)
    // ページ遷移が起きる場合は次で指定
    await page.waitForLoadState('networkidle')
  },
}
