---
name: environment-variables
description: プロジェクトで使用する環境変数の定義と使用方法を提供するスキル。Supabase、Stripe、Logger、Platformなど全環境変数の設定方法を網羅。
---

# Environment Variables スキル

## 概要

このスキルは、Quest Payアプリケーションで使用するすべての環境変数の定義、設定方法、セキュリティベストプラクティスを提供します。

## メインソースファイル

### 環境変数ファイル
- `.env`: デフォルト設定（Gitにコミット可能）
- `.env.local`: ローカル開発環境用（Gitにコミット禁止）
- `.env.production`: 本番環境用（Gitにコミット禁止）

### 使用場所
- `app/(core)/_supabase/client.ts`: Supabase設定
- `app/(core)/_supabase/server.ts`: サーバーサイドSupabase
- `app/(core)/logger.ts`: ログレベル設定
- `drizzle.config.ts`: Database設定
- `next.config.ts`: Platform設定

## 主要機能グループ

### 1. 基本変数（必須）
- Supabase: プロジェクトURL、認証キー
- Database: 接続URL
- App Domain: アプリケーションドメイン

### 2. オプション変数
- Logger: ログレベル設定
- Platform: Capacitor/Web切り替え

### 3. 機能別変数
- Stripe: 決済機能（オプション）
- Email: メール送信（オプション）

## Reference Files Usage

### 環境変数一覧を確認する場合
すべての環境変数の完全リストと詳細仕様を確認：
```
references/variable_list.md
```

### 初期セットアップを行う場合
ステップバイステップの設定手順を確認：
```
references/setup_guide.md
```

### セキュリティを確認する場合
機密情報の取り扱い、ベストプラクティスを確認：
```
references/security_notes.md
```

## クイックスタート

1. **初回セットアップ**: `references/setup_guide.md`で手順確認
2. **変数追加時**: `references/variable_list.md`で既存変数確認
3. **セキュリティレビュー**: `references/security_notes.md`で確認

## 実装上の注意点

### 必須パターン
1. **機密情報は`.env.local`**: Gitにコミットしない
2. **公開可能な変数のみ`NEXT_PUBLIC_`**: クライアント公開
3. **環境別設定**: 開発/本番で異なる値を使用

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

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


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
