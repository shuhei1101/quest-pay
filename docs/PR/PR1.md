# PR1: E2Eテスト基盤構築＆アカウント登録テスト実装

## 概要

Quest Pay のE2Eテスト基盤を最小構成で構築し、**アカウント登録フロー** の自動化テストを実装する。Playwright を用いて、ローカル開発環境でテストを実行可能な状態を目指す。

**目標**: アカウント登録～ログインまでの流れが自動で検証できる状態

---

## 作業内容

- [ ] **Playwright設定ファイル作成**
  - `playwright.config.ts` を作成（ブラウザ・タイムアウト・スクリーンショット設定など）
  - テスト実行時に `.env.test` を読み込む設定
  
- [ ] **テストディレクトリ構成のセットアップ**
  - `tests/e2e/` ディレクトリ作成
  - テスト用ヘルパー関数・リポジトリ構成（将来拡張性を見据えた最小構成）

- [ ] **スクリーンショット自動保存機能**
  - テスト失敗時にスクリーンショットを自動保存する設定
  - 保存先: `test-results/`

- [ ] **アカウント登録テスト実装（MVP）**
  - テストケース: `新規ユーザーがアカウント登録してログインできる`
  - テストデータ: `.env.test` の `E2E_PARENT_A_EMAIL`, `E2E_PARENT_A_PASSWORD` を使用
  - フロー:
    1. アカウント登録ページにアクセス
    2. メール・パスワード入力
    3. アカウント作成ボタンクリック
    4. ホーム画面へリダイレクト確認
    5. ログアウト → ログイン可能か検証

- [ ] **テスト実行確認**
  - `npm run test:e2e` で正常に実行できることを確認
  - スクリーンショットが `test-results/` に保存されることを確認

---

## 実装のアプローチ

### ツール・技術選定
- **Playwright** （既にインストール済み）
- **Node.js** + **TypeScript**
- **環境変数** （`.env.test`）

### ディレクトリ構成（案）
```
packages/web/
├── playwright.config.ts          ← 設定ファイル
├── tests/
│   └── e2e/
│       ├── auth.spec.ts          ← アカウント登録・ログインテスト
│       └── helpers/
│           └── auth.helper.ts    ← 認証周りのヘルパー関数（将来拡張用）
├── test-results/                 ← 失敗時スクリーンショット保存先
└── .env.test                      ← テスト用環境変数（既存）
```

### 実装例（概略）
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('新規ユーザーがアカウント登録してログインできる', async ({ page }) => {
  // 1. アカウント登録ページへ
  await page.goto(`${process.env.BASE_URL}/signup`)
  
  // 2. フォーム入力
  await page.fill('input[name="email"]', process.env.E2E_PARENT_A_EMAIL)
  await page.fill('input[name="password"]', process.env.E2E_PARENT_A_PASSWORD)
  
  // 3. 登録ボタン
  await page.click('button[type="submit"]')
  
  // 4. ホーム画面へリダイレクト確認
  await expect(page).toHaveURL('/home')
})
```

---

## テスト観点（将来の拡張も視野に）

**今回実装** 
- ✅ アカウント登録フロー（1ケース）

**将来的なテストシナリオ**（ロードマップ）
- 複数家族管理（家族A・B のセットアップ）
- クエスト登録・共有・いいね・コメント
- クエストテンプレート～クエスト作成フロー
- 子供のクエスト受注～完了フロー
- エラーハンドリング（不正なメール形式など）

---

## テスト実行方法

```bash
# ローカル環境でサーバー起動（別ターミナル）
npm run dev

# テスト実行（ブラウザが開く）
npm run test:e2e:headed

# UI モードで実行（失敗箇所の確認に便利）
npm run test:e2e:ui
```

---

## 懸念点・注意事項

1. **テストデータの初期化**: 毎回アカウント作成前にテストDBをリセットする仕組みが必要かも
   → MVP では既存の `.env.test` アカウントをそのまま再利用で OK
   
2. **タイムアウト**: 初回テスト実行時は Chromium DL に時間がかかる可能性
   → `npm run test:e2e:install` でブラウザをプリインストール推奨

3. **CI/CD**: 今回は手動実行ベース。将来的に GitHub Actions 連携も検討

---

## 参考資料

- [Playwright 公式ドキュメント](https://playwright.dev/docs/intro)
- `.env.test` — テスト用環境変数定義済み
- `package.json` — `test:e2e` スクリプト定義済み

