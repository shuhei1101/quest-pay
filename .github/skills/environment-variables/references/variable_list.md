# Environment Variables リファレンス
> 2026年3月記載

## 概要

Quest Payプロジェクトで使用するすべての環境変数の完全リスト。

## 環境変数一覧

### Supabase関連

#### NEXT_PUBLIC_SUPABASE_URL
- **種類**: クライアント公開可能
- **説明**: Supabase プロジェクトURL
- **必須**: ✅
- **デフォルト値**: なし
- **使用場所**: 
  - `app/(core)/_supabase/client.ts`
  - `app/(core)/_supabase/server.ts`
- **取得方法**: Supabaseダッシュボード > Settings > API
- **フォーマット例**: `https://xxxxxxxxxxxxx.supabase.co`

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **種類**: クライアント公開可能
- **説明**: Supabase 匿名キー（公開可能な認証キー）
- **必須**: ✅
- **デフォルト値**: なし
- **使用場所**: 
  - `app/(core)/_supabase/client.ts`
  - `app/(core)/_supabase/server.ts`
- **取得方法**: Supabaseダッシュボード > Settings > API
- **セキュリティ**: Row Level Security (RLS) で保護されているため公開可能

#### SUPABASE_SERVICE_ROLE_KEY
- **種類**: サーバー専用（秘密）
- **説明**: Supabase サービスロールキー（RLSバイパス権限）
- **必須**: ✅（サーバーサイドAPI使用時）
- **デフォルト値**: なし
- **使用場所**: サーバーサイドAPI（admin操作）
- **取得方法**: Supabaseダッシュボード > Settings > API
- **セキュリティ**: ⚠️ **絶対に公開しない** - すべてのRLSをバイパス可能

### Database

#### DATABASE_URL
- **種類**: サーバー専用
- **説明**: PostgreSQL接続URL
- **必須**: ✅
- **デフォルト値**: なし
- **使用場所**: 
  - `drizzle.config.ts`
  - マイグレーション実行
  - Drizzle ORM直接接続
- **取得方法**: Supabaseダッシュボード > Settings > Database > Connection string
- **フォーマット**: `postgresql://[user]:[password]@[host]:[port]/[database]`
- **注意**: パスワードを含むため`.env.local`で管理

### Application

#### APP_DOMAIN
- **種類**: サーバー専用
- **説明**: アプリケーションのベースドメイン
- **必須**: ✅
- **デフォルト値**: `http://localhost:3000`
- **使用場所**: 
  - API（リダイレクトURL生成）
  - メール送信（リンク生成）
  - 外部サービスコールバック
- **設定例**:
  - 開発: `http://localhost:3000`
  - 本番: `https://yourdomain.com`

### Logger

#### NEXT_PUBLIC_LOG_LEVEL
- **種類**: クライアント公開可能
- **説明**: ログ出力レベル
- **必須**: ❌
- **デフォルト値**: `info`
- **使用場所**: `app/(core)/logger.ts`
- **設定値**: `debug` | `info` | `warn` | `error`
- **推奨設定**:
  - 開発環境: `debug` または `info`
  - 本番環境: `warn` または `error`

**ログレベルの意味**:
- `debug`: すべてのログを出力（最も詳細）
- `info`: 情報ログ以上を出力
- `warn`: 警告とエラーのみ出力
- `error`: エラーのみ出力（最も制限的）

### Platform

#### NEXT_PUBLIC_PLATFORM
- **種類**: クライアント公開可能
- **説明**: プラットフォーム識別子
- **必須**: ❌
- **デフォルト値**: なし（Webブラウザ想定）
- **使用場所**: `next.config.ts`
- **設定値**: `capacitor` または未設定
- **動作**:
  - `capacitor`: 静的エクスポート有効化（ネイティブアプリ用）
  - 未設定: 通常のNext.jsビルド（Webブラウザ用）

### Stripe決済

#### STRIPE_SECRET_KEY
- **種類**: サーバー専用（秘密）
- **説明**: Stripe秘密鍵
- **必須**: ✅（決済機能使用時）
- **デフォルト値**: なし
- **使用場所**: サーバーサイドAPI（決済処理）
- **取得方法**: Stripeダッシュボード > Developers > API keys
- **フォーマット**: `sk_test_...` (テスト) / `sk_live_...` (本番)
- **セキュリティ**: ⚠️ **絶対に公開しない**

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **種類**: クライアント公開可能
- **説明**: Stripe公開鍵
- **必須**: ✅（決済機能使用時）
- **デフォルト値**: なし
- **使用場所**: クライアントサイド決済フォーム
- **取得方法**: Stripeダッシュボード > Developers > API keys
- **フォーマット**: `pk_test_...` (テスト) / `pk_live_...` (本番)

#### STRIPE_WEBHOOK_SECRET
- **種類**: サーバー専用（秘密）
- **説明**: Webhook署名検証用シークレット
- **必須**: ✅（Webhook使用時）
- **デフォルト値**: なし
- **使用場所**: Webhook検証（`/api/webhooks/stripe`）
- **取得方法**: 
  - ローカル: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
  - 本番: Stripeダッシュボード > Webhooks
- **フォーマット**: `whsec_...`

#### NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY
- **種類**: クライアント公開可能
- **説明**: Liteプラン月額の価格ID
- **必須**: ✅（サブスクリプション機能使用時）
- **デフォルト値**: なし
- **使用場所**: 決済画面（プラン選択）
- **取得方法**: Stripeダッシュボード > Products
- **フォーマット**: `price_...`

#### NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY
- **種類**: クライアント公開可能
- **説明**: Liteプラン年額の価格ID
- **必須**: ✅（サブスクリプション機能使用時）
- **デフォルト値**: なし
- **使用場所**: 決済画面（プラン選択）
- **取得方法**: Stripeダッシュボード > Products
- **フォーマット**: `price_...`

### Email送信

#### ICLOUD_SMTP_USER
- **種類**: サーバー専用（秘密）
- **説明**: iCloud SMTPユーザー名
- **必須**: ❌（メール送信機能使用時のみ）
- **デフォルト値**: なし
- **使用場所**: メール送信機能
- **フォーマット**: `your-email@icloud.com`

#### ICLOUD_SMTP_PASS
- **種類**: サーバー専用（秘密）
- **説明**: iCloud SMTPアプリ専用パスワード
- **必須**: ❌（メール送信機能使用時のみ）
- **デフォルト値**: なし
- **使用場所**: メール送信機能
- **取得方法**: Apple IDアカウント管理 > セキュリティ > App用パスワード
- **セキュリティ**: ⚠️ **絶対に公開しない**

## 環境別変数マトリクス

| 変数名 | 開発環境 | 本番環境 | 公開可能 |
|--------|---------|---------|---------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ | ✅ |
| SUPABASE_SERVICE_ROLE_KEY | ✅ | ✅ | ❌ |
| DATABASE_URL | ✅ | ✅ | ❌ |
| APP_DOMAIN | localhost | 本番URL | ❌ |
| NEXT_PUBLIC_LOG_LEVEL | debug/info | warn/error | ✅ |
| NEXT_PUBLIC_PLATFORM | - | capacitor | ✅ |
| STRIPE_SECRET_KEY | test | live | ❌ |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | test | live | ✅ |
| STRIPE_WEBHOOK_SECRET | test | live | ❌ |
| ICLOUD_SMTP_USER | ✅ | ✅ | ❌ |
| ICLOUD_SMTP_PASS | ✅ | ✅ | ❌ |

## 必須/オプション判定

### 必須変数（すべての環境）
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- DATABASE_URL

### 必須変数（機能別）
- **決済機能**: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- **サブスクリプション**: STRIPE_PRICE_ID系
- **メール送信**: ICLOUD_SMTP_USER, ICLOUD_SMTP_PASS
- **管理者API**: SUPABASE_SERVICE_ROLE_KEY

### オプション変数
- APP_DOMAIN（デフォルト: localhost:3000）
- NEXT_PUBLIC_LOG_LEVEL（デフォルト: info）
- NEXT_PUBLIC_PLATFORM（デフォルト: Web）
