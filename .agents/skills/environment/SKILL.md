---
name: environment
description: '環境変数設定の知識を提供するスキル。.env・.env.local・.env.productionの設定方法・NEXT_PUBLIC_プレフィックスルール・必須環境変数一覧を含む。'
---

# 環境変数設定 スキル

## 概要

Quest Pay プロジェクトの環境変数管理。Supabase・Stripe・Logger の設定を含む。

## 環境変数ファイル

| ファイル | 用途 |
|---------|------|
| `.env` | 全環境共通の変数（Git 管理対象外） |
| `.env.local` | ローカル開発用（Git 管理対象外） |
| `.env.production` | 本番環境用 |

ファイル場所: `packages/web/` 配下

## NEXT_PUBLIC_ プレフィックスルール

- **クライアント側で使用**: `NEXT_PUBLIC_` プレフィックスを付ける
- **サーバー側のみ**: プレフィックスなし（クライアントには露出しない）

```bash
# クライアント側で使用（ブラウザから参照可能）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# サーバー側のみ（シークレット）
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_...
```

## 必須環境変数

### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=          # Supabase プロジェクト URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase 匿名キー（公開）
SUPABASE_SERVICE_ROLE_KEY=         # Supabase サービスロールキー（シークレット）
```

### Stripe（決済機能）
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripe 公開キー
STRIPE_SECRET_KEY=                  # Stripe シークレットキー
```

### ロガー
```bash
NEXT_PUBLIC_LOG_LEVEL=             # ログレベル（debug/info/warn/error）
```

## 環境変数の参照方法

```typescript
// クライアント側
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// サーバー側（route.ts / service.ts）
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
```

## 実装上の注意点

- `.env.local` は Git にコミットしない（`.gitignore` に含まれる）
- シークレットキーは絶対に `NEXT_PUBLIC_` を付けない
- 本番環境の変数は Vercel / Supabase のダッシュボードで管理
- `NEXT_PUBLIC_LOG_LEVEL` で本番はログを制限する（`warn` 以上推奨）
