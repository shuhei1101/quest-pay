---
name: environment-variables
description: プロジェクトで使用する環境変数の定義と使用方法を提供するスキル。Supabase、Stripe、Logger、Platformなど全環境変数の設定方法を網羅。
---

# Environment Variables

## 概要

このスキルは、お小遣いクエストボードプロジェクトで使用する環境変数の定義と使用方法を提供する。環境変数の追加・変更時は、必ずこのスキルを更新すること。

## 環境変数ファイル

### ファイル構成

- **`.env`**: デフォルト設定（すべての環境で共通）
- **`.env.local`**: ローカル開発環境用（Gitにコミットしない）
- **`.env.production`**: 本番環境用（未作成の場合は作成推奨）

**重要**: `.env.local`と`.env.production`は機密情報を含むため、`.gitignore`に追加済み。絶対にGitにコミットしないこと。

## 環境変数一覧

### Supabase関連

| 変数名 | 種類 | 説明 | 使用場所 | 取得方法 |
|--------|------|------|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | クライアント | Supabase プロジェクトURL | `app/(core)/_supabase/client.ts`<br>`app/(core)/_supabase/server.ts` | Supabaseダッシュボード > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | クライアント | Supabase 匿名キー（公開可能） | `app/(core)/_supabase/client.ts`<br>`app/(core)/_supabase/server.ts` | Supabaseダッシュボード > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー | Supabase サービスロールキー（秘密） | サーバーサイドAPI | Supabaseダッシュボード > Settings > API |

**注意**: `NEXT_PUBLIC_` プレフィックスはクライアントサイドで公開される。機密情報には使用しないこと。

### Database

| 変数名 | 種類 | 説明 | 使用場所 | 取得方法 |
|--------|------|------|----------|----------|
| `DATABASE_URL` | サーバー | PostgreSQL接続URL | `drizzle.config.ts`<br>マイグレーション<br>Drizzle ORM | Supabaseダッシュボード > Settings > Database > Connection string |

**フォーマット**: `postgresql://[user]:[password]@[host]:[port]/[database]`

### App Domain

| 変数名 | 種類 | 説明 | 使用場所 | 設定例 |
|--------|------|------|----------|--------|
| `APP_DOMAIN` | サーバー | アプリケーションのドメイン | API、リダイレクト、メール送信 | 開発: `http://localhost:3000`<br>本番: `https://yourdomain.com` |

### Logger設定

| 変数名 | 種類 | 説明 | 使用場所 | 設定値 |
|--------|------|------|----------|--------|
| `NEXT_PUBLIC_LOG_LEVEL` | クライアント | ログレベル | `app/(core)/logger.ts` | `debug`, `info`, `warn`, `error`<br>デフォルト: `info` |

**ログレベルの意味**:
- `debug`: デバッグ情報を含むすべてのログを出力
- `info`: 通常の情報ログ以上を出力（推奨：開発環境）
- `warn`: 警告とエラーのみ出力
- `error`: エラーのみ出力（推奨：本番環境）

### Platform設定

| 変数名 | 種類 | 説明 | 使用場所 | 設定値 |
|--------|------|------|----------|--------|
| `NEXT_PUBLIC_PLATFORM` | クライアント | プラットフォーム識別子 | `next.config.ts` | `capacitor`: Capacitorビルド時<br>未設定: Webブラウザ |

**用途**: Capacitorでのネイティブアプリビルド時、静的エクスポートを有効化するために使用。

### Stripe設定（決済機能）

| 変数名 | 種類 | 説明 | 使用場所 | 取得方法 |
|--------|------|------|----------|----------|
| `STRIPE_SECRET_KEY` | サーバー | Stripe秘密鍵 | サーバーサイドAPI | Stripeダッシュボード > Developers > API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | クライアント | Stripe公開鍵 | クライアントサイド決済フォーム | Stripeダッシュボード > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | サーバー | Webhook署名シークレット | Webhook検証 | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY` | クライアント | Liteプラン月額の価格ID | 決済画面 | Stripeダッシュボード > Products |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY` | クライアント | Liteプラン年額の価格ID | 決済画面 | Stripeダッシュボード > Products |

**テストモード/本番モード**:
- テストモード: キーに `test` が含まれる（例: `sk_test_...`, `pk_test_...`）
- 本番モード: キーに `live` が含まれる（例: `sk_live_...`, `pk_live_...`）

### メール送信設定

| 変数名 | 種類 | 説明 | 使用場所 |
|--------|------|------|----------|
| `ICLOUD_SMTP_USER` | サーバー | iCloud SMTPユーザー名 | メール送信機能 |
| `ICLOUD_SMTP_PASS` | サーバー | iCloud SMTPパスワード | メール送信機能 |

**注意**: 本番環境では、SendGrid、AWS SES、Resendなどの専用メール送信サービスへの移行を推奨。

## 環境変数の使用方法

### クライアントサイド

`NEXT_PUBLIC_` プレフィックス付き変数は、クライアントサイドで使用可能：

```typescript
// app/(core)/_supabase/client.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません')
}

export const supabase = createBrowserSupabaseClient(supabaseUrl, supabaseAnonKey)
```

### サーバーサイド

プレフィックスなし変数は、サーバーサイドのみで使用可能：

```typescript
// drizzle.config.ts
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### 型安全性の確保

環境変数には型定義を追加することを推奨：

```typescript
// app/(core)/config/env.ts
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    priceIdLiteMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY!,
    priceIdLiteYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY!,
  },
  logger: {
    level: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
  },
  platform: process.env.NEXT_PUBLIC_PLATFORM,
} as const

// 起動時バリデーション
if (!env.supabase.url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
if (!env.supabase.anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
```

## セットアップ手順

### 1. 環境変数ファイルの作成

```bash
cd packages/web
cp .env .env.local
```

### 2. 環境変数の設定

`.env.local`を編集して、各環境変数を設定：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database設定
DATABASE_URL="postgresql://user:password@host:port/database"

# App Domain
APP_DOMAIN="http://localhost:3000"

# Logger設定
NEXT_PUBLIC_LOG_LEVEL="debug"

# Platform設定（Capacitorビルド時のみ）
# NEXT_PUBLIC_PLATFORM="capacitor"

# Stripe設定（決済機能を使う場合）
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY="price_..."

# メール送信設定（使う場合）
ICLOUD_SMTP_USER="your-email@icloud.com"
ICLOUD_SMTP_PASS="your-password"
```

### 3. 設定の確認

```bash
npm run dev
```

起動時にエラーが出る場合、環境変数が正しく設定されているか確認。

## トラブルシューティング

### 環境変数が読み込まれない

**原因**: Next.jsは起動時に環境変数を読み込むため、変更後は再起動が必要。

**解決策**:
```bash
# 開発サーバーを再起動
npm run dev
```

### `NEXT_PUBLIC_` 変数がクライアントで undefined

**原因**: 
1. ファイル名が間違っている（`.env.local`ではなく`.env.locale`など）
2. 変数名のタイポ
3. サーバーを再起動していない

**解決策**:
1. ファイル名を確認
2. 変数名を再確認
3. サーバーを再起動

### Supabase接続エラー

**原因**: URLまたはキーが間違っている。

**解決策**:
1. Supabaseダッシュボードで正しいURLとキーを確認
2. `.env.local`の値を更新
3. サーバーを再起動

## ベストプラクティス

### 1. 機密情報の管理

- ❌ **絶対にやってはいけない**: `.env.local`や`.env.production`をGitにコミット
- ✅ **推奨**: `.gitignore`に環境変数ファイルを追加済み
- ✅ **推奨**: チーム内では、1Password、AWS Secrets Manager、環境変数管理サービスを利用

### 2. デフォルト値の設定

```typescript
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info'
```

### 3. 必須チェック

起動時に必須環境変数をチェック：

```typescript
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}
```

### 4. 環境別設定

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

const apiUrl = isDevelopment 
  ? 'http://localhost:3000/api' 
  : 'https://yourdomain.com/api'
```

## 新規環境変数の追加手順

1. **`.env`に追加**: デフォルト値または説明コメントを追加
2. **`.env.local`に追加**: 開発環境用の実際の値を設定
3. **このスキルを更新**: 上記の環境変数一覧テーブルに追加
4. **型定義を追加**: `env.ts`に型定義を追加（推奨）
5. **チームに通知**: 新しい環境変数をチームメンバーに共有

## 関連スキル

- `logger-management`: `NEXT_PUBLIC_LOG_LEVEL`の詳細な使用方法
- `database-operations`: `DATABASE_URL`を使用したDB操作
- `architecture-guide`: 環境変数を使用したアーキテクチャパターン

## 参考リンク

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase Client Libraries](https://supabase.com/docs/reference/javascript/installing)
- [Stripe API Keys](https://stripe.com/docs/keys)
