import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env.test' })

const PARENT_A_EMAIL = process.env.E2E_PARENT_A_EMAIL || ''
const PARENT_A_PASSWORD = process.env.E2E_PARENT_A_PASSWORD || ''

test.describe('認証フロー', () => {
  test('新規ユーザーがアカウント登録してメール確認ページに遷移できる', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByRole('heading', { name: '新規登録' })).toBeVisible()

    await page.getByPlaceholder('your-email@example.com').fill(PARENT_A_EMAIL)
    await page.getByPlaceholder('6文字以上').fill(PARENT_A_PASSWORD)

    await page.getByRole('button', { name: 'アカウントを作成' }).click()

    await page.waitForURL('**/signup/verify-email**', { timeout: 10000 })
    await expect(page).toHaveURL(/.*\/signup\/verify-email/)
  })

  test('既存ユーザーがログインしてホーム画面に遷移できる', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    await page.getByPlaceholder('your-email@example.com').fill(PARENT_A_EMAIL)
    await page.getByPlaceholder('パスワードを入力').fill(PARENT_A_PASSWORD)

    await page.getByRole('button', { name: 'ログイン' }).click()

    await page.waitForURL('**/home', { timeout: 10000 })
    await expect(page).toHaveURL(/.*\/home/)
  })
})
