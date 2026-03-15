# Environment Variables Setup Guide
> 2026年3月記載

## 概要

Quest Payプロジェクトの環境変数セットアップ手順を段階的に説明。

## セットアップフロー

```
1. 環境変数ファイル作成
   ↓
2. 基本変数設定（Supabase、Database）
   ↓
3. オプション変数設定（Logger、Platform）
   ↓
4. 機能別変数設定（Stripe、Email）
   ↓
5. 動作確認
```

## 1. 環境変数ファイル作成

### ステップ1-1: `.env.local`ファイル作成

プロジェクトルートに`.env.local`ファイルを作成：

```bash
cd /path/to/quest-pay
touch .env.local
```

### ステップ1-2: `.gitignore`確認

`.env.local`が`.gitignore`に含まれていることを確認：

```bash
# .gitignore
.env.local
.env.production
```

## 2. 基本変数設定

### ステップ2-1: Supabaseプロジェクト情報取得

1. [Supabase Dashboard](https://app.supabase.com)にログイン
2. プロジェクトを選択
3. Settings > API に移動
4. 以下の情報をコピー：
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`用
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`用
   - **service_role**: `SUPABASE_SERVICE_ROLE_KEY`用

### ステップ2-2: Database URL取得

1. Supabase Dashboard > Settings > Database に移動
2. Connection string > URI をコピー
3. `[YOUR-PASSWORD]`部分を実際のパスワードに置換

### ステップ2-3: `.env.local`に記載

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# App Domain
APP_DOMAIN=http://localhost:3000
```

## 3. オプション変数設定

### ステップ3-1: Logger設定

開発環境では詳細ログを有効化：

```bash
# Logger
NEXT_PUBLIC_LOG_LEVEL=debug
```

本番環境では制限的に：

```bash
# Logger
NEXT_PUBLIC_LOG_LEVEL=error
```

### ステップ3-2: Platform設定

Webブラウザのみの場合は不要。Capacitor（ネイティブアプリ）をビルドする場合：

```bash
# Platform
NEXT_PUBLIC_PLATFORM=capacitor
```

## 4. 機能別変数設定

### ステップ4-1: Stripe決済（オプション）

#### 4-1-1: Stripeアカウント作成
1. [Stripe Dashboard](https://dashboard.stripe.com)でアカウント作成
2. Developers > API keys に移動

#### 4-1-2: APIキー取得
- **テストモード** でキーを取得（開発環境用）
- **Publishable key**: `pk_test_...`
- **Secret key**: `sk_test_...`

#### 4-1-3: Webhook設定（ローカル開発）

ターミナルで Stripe CLI を実行：

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

出力される`whsec_...`をコピー。

#### 4-1-4: 価格ID作成

1. Stripe Dashboard > Products > Add product
2. Liteプランを作成し、月額・年額の価格を設定
3. 各価格の`price_...` IDをコピー

#### 4-1-5: `.env.local`に記載

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY=price_...
```

### ステップ4-2: Email送信（オプション）

#### 4-2-1: iCloud App用パスワード取得

1. Apple IDアカウント管理 > セキュリティ
2. App用パスワードを生成
3. 生成されたパスワードをコピー

#### 4-2-2: `.env.local`に記載

```bash
# Email
ICLOUD_SMTP_USER=your-email@icloud.com
ICLOUD_SMTP_PASS=xxxx-xxxx-xxxx-xxxx
```

⚠️ **注意**: 本番環境ではSendGrid、AWS SES、Resendなどの専用サービスを推奨。

## 5. 動作確認

### ステップ5-1: 環境変数読み込みテスト

開発サーバーを起動：

```bash
npm run dev
```

ブラウザのコンソールで確認：

```javascript
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('LOG_LEVEL:', process.env.NEXT_PUBLIC_LOG_LEVEL)
```

### ステップ5-2: Database接続テスト

Drizzle Studioを起動：

```bash
npm run db:studio
```

データベースに接続できればOK。

### ステップ5-3: Stripe接続テスト（設定した場合）

決済画面にアクセスして、Stripeの公開鍵が正しく読み込まれているか確認：

```bash
http://localhost:3000/payment
```

## 本番環境設定

### 本番用`.env.production`作成

```bash
# Supabase (本番プロジェクト)
NEXT_PUBLIC_SUPABASE_URL=https://production-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Database (本番)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.production-xxx.supabase.co:5432/postgres

# App Domain (本番)
APP_DOMAIN=https://yourdomain.com

# Logger (本番)
NEXT_PUBLIC_LOG_LEVEL=error

# Stripe (本番: liveキーに切り替え)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (本番Webhook用)
NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY=price_...
```

### ホスティングサービスでの設定

**Vercel**:
1. Project Settings > Environment Variables
2. 各変数を追加（本番用の値を設定）

**Netlify**:
1. Site settings > Build & deploy > Environment
2. 各変数を追加

**AWS Amplify**:
1. App settings > Environment variables
2. 各変数を追加

## トラブルシューティング

### 問題1: `process.env.NEXT_PUBLIC_XXX`が`undefined`

**原因**: `NEXT_PUBLIC_`プレフィックスが必要
**解決**: クライアントで使う変数には`NEXT_PUBLIC_`を付ける

### 問題2: `.env.local`の変更が反映されない

**原因**: Next.jsサーバーが再起動されていない
**解決**: 開発サーバーを停止して再起動

```bash
# Ctrl+C で停止
npm run dev
```

### 問題3: Database接続エラー

**原因**: DATABASE_URLにパスワードが含まれていない
**解決**: `[YOUR-PASSWORD]`を実際のパスワードに置換

### 問題4: Stripe Webhookが動作しない

**原因**: `stripe listen`が起動していない、またはポートが違う
**解決**: Stripe CLIを正しいポートで再起動

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## セキュリティチェックリスト

- [ ] `.env.local`が`.gitignore`に含まれている
- [ ] `SUPABASE_SERVICE_ROLE_KEY`をクライアントコードで使用していない
- [ ] `STRIPE_SECRET_KEY`をクライアントコードで使用していない
- [ ] `DATABASE_URL`に実パスワードが含まれている場合、公開されていない
- [ ] 本番環境で`test`キーではなく`live`キーを使用している
- [ ] 本番環境の`NEXT_PUBLIC_LOG_LEVEL`が`error`または`warn`に設定されている
