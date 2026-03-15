# Security Notes for Environment Variables
> 2026年3月記載

## 概要

環境変数のセキュリティに関する重要事項と実践ガイド。

## 重大なセキュリティ規則

### 🚨 絶対に公開してはいけない変数

以下の変数は**クライアントサイドコードで使用禁止**、**Gitにコミット禁止**：

1. **SUPABASE_SERVICE_ROLE_KEY**
   - RLS（Row Level Security）をバイパス可能
   - すべてのデータベース操作が無制限に実行可能
   - **影響**: データベース全体への完全なアクセス権限

2. **STRIPE_SECRET_KEY**
   - 決済処理、払い戻し、顧客情報へのアクセスが可能
   - **影響**: 金銭的損失、顧客情報漏洩

3. **DATABASE_URL**
   - データベースへの直接接続情報（パスワード含む）
   - **影響**: データベース全体への直接アクセス

4. **STRIPE_WEBHOOK_SECRET**
   - Webhook署名検証に使用
   - **影響**: 偽のWebhook送信による不正操作

5. **ICLOUD_SMTP_PASS**
   - メール送信アカウントのパスワード
   - **影響**: なりすましメール送信

### ✅ 公開可能な変数（`NEXT_PUBLIC_`プレフィックス）

以下の変数はクライアントサイドで使用可能で、バンドルに含まれます：

- **NEXT_PUBLIC_SUPABASE_URL**: Supabaseプロジェクト識別子（公開情報）
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: RLSで保護されたAPIキー
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Stripe公開鍵
- **NEXT_PUBLIC_LOG_LEVEL**: ログレベル設定
- **NEXT_PUBLIC_PLATFORM**: プラットフォーム識別子
- **NEXT_PUBLIC_STRIPE_PRICE_ID_***: 価格ID（公開情報）

## セキュリティレベル分類

### レベル1: 🔴 Critical（最高機密）
**漏洩した場合の影響**: システム全体の侵害、金銭的損失

| 変数名 | 理由 |
|--------|------|
| SUPABASE_SERVICE_ROLE_KEY | RLSバイパス可能 |
| STRIPE_SECRET_KEY | 決済・払い戻し実行可能 |
| DATABASE_URL | データベースパスワード含む |
| ICLOUD_SMTP_PASS | メールアカウント侵害 |

**対策**:
- サーバーサイドのみで使用
- `.env.local`で管理（Gitにコミットしない）
- ホスティングサービスの環境変数機能で暗号化保存
- 定期的なローテーション

### レベル2: 🟡 Moderate（中機密）
**漏洩した場合の影響**: 一部機能の不正利用

| 変数名 | 理由 |
|--------|------|
| STRIPE_WEBHOOK_SECRET | Webhook偽造可能 |

**対策**:
- サーバーサイドのみで使用
- `.env.local`で管理
- 本番環境とテスト環境で別のシークレット使用

### レベル3: 🟢 Public（公開可能）
**漏洩した場合の影響**: 最小限（RLSや他の保護機構で制限）

| 変数名 | 理由 |
|--------|------|
| NEXT_PUBLIC_SUPABASE_ANON_KEY | RLSで保護 |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | 公開前提の設計 |
| NEXT_PUBLIC_LOG_LEVEL | 機密情報なし |

**対策**:
- クライアントサイドで使用可能
- バージョン管理可能（`.env`にコミット可）

## 実践ガイド

### 1. サーバーサイドコードでの使用

**✅ 正しい使用例**

```typescript
// app/api/admin/route.ts (サーバーサイド)
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // サーバー専用キーを使用（RLSバイパス）
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // OK: サーバーサイドのみ
  )
  
  // 管理者操作
  const { data } = await supabase.auth.admin.listUsers()
  return Response.json(data)
}
```

**❌ 危険な使用例**

```typescript
// app/components/UserList.tsx (クライアントサイド)
'use client'

import { createClient } from '@supabase/supabase-js'

export function UserList() {
  // ❌ DANGER: クライアントコードでSERVICE_ROLE_KEY使用
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // ❌ ブラウザに露出！
  )
  
  // ...
}
```

### 2. クライアントサイドコードでの使用

**✅ 正しい使用例**

```typescript
// app/(core)/_supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,     // OK: 公開可能
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // OK: RLSで保護
  )
}
```

### 3. 環境変数ファイル管理

**`.env`**（Gitにコミット可能）
```bash
# デフォルト設定（機密情報なし）
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_PLATFORM=
```

**`.env.local`**（Gitにコミット禁止）
```bash
# 機密情報（.gitignoreに追加）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # 🔴 Critical
DATABASE_URL=postgresql://...          # 🔴 Critical
STRIPE_SECRET_KEY=sk_test_...          # 🔴 Critical
STRIPE_WEBHOOK_SECRET=whsec_...        # 🟡 Moderate
ICLOUD_SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # 🔴 Critical
```

**`.gitignore`**
```bash
# 環境変数ファイル
.env.local
.env.production
.env*.local
```

## 侵害時の対応手順

### Step 1: 侵害検知

**兆候**:
- 不正なAPIリクエストの急増
- 予期しないデータベース変更
- Stripe決済の異常
- 不正なメール送信

### Step 2: 即座の対応

1. **該当キーの無効化**
   - Supabase: Dashboard > Settings > API > Reset service_role key
   - Stripe: Dashboard > Developers > API keys > Revoke
   - Database: パスワード変更

2. **アクセスログ確認**
   - Supabase: Dashboard > Logs
   - Stripe: Dashboard > Logs
   - Application logs

### Step 3: キーローテーション

1. 新しいキーを生成
2. `.env.local`を更新
3. ホスティングサービスの環境変数を更新
4. アプリケーションを再デプロイ

### Step 4: 被害範囲確認

- データベース変更履歴
- 決済履歴
- ユーザーアカウント状況

## ベストプラクティス

### 1. 環境変数のローテーション

- **Supabase Service Role Key**: 6ヶ月ごと
- **Stripe Keys**: 1年ごと、または侵害疑いがある場合即座
- **Database Password**: 3ヶ月ごと

### 2. アクセス制限

```typescript
// ミドルウェアで管理者APIを保護
// middleware.ts
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // 管理者APIへのアクセス制限
  if (path.startsWith('/api/admin')) {
    // 認証チェック、IPホワイトリストなど
  }
}
```

### 3. Supabase RLS設定

データベースレベルでアクセス制御：

```sql
-- ユーザーは自分のデータのみ参照可能
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- 子供は自分の家族のクエストのみ参照可能
CREATE POLICY "Children can view family quests"
ON family_quests FOR SELECT
USING (family_id IN (
  SELECT family_id FROM children WHERE user_id = auth.uid()
));
```

### 4. Stripe Webhookセキュリティ

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  
  try {
    // Webhook署名検証（必須）
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    // イベント処理
    // ...
  } catch (err) {
    // 署名検証失敗 = 不正なWebhook
    return new Response('Invalid signature', { status: 400 })
  }
}
```

### 5. ログから機密情報を除外

```typescript
// app/(core)/logger.ts
import log from 'loglevel'

// ❌ 危険: パスワードをログ出力
log.debug('User password:', password)

// ✅ 正しい: 機密情報をマスク
log.debug('User authenticated:', { userId, email: maskEmail(email) })

function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  return `${name.slice(0, 2)}***@${domain}`
}
```

## チーム共有時の注意

### 開発環境の共有

**❌ やってはいけない**:
- Slackやメールで`.env.local`を送信
- スクリーンショットに環境変数を含める
- コード例に実際のキーを含める

**✅ 安全な共有方法**:
- 1Password、LastPassなどのパスワード管理ツール
- AWS Secrets Manager、HashiCorp Vaultなどのシークレット管理サービス
- 暗号化されたチャネル（Signal、Wire）

### `.env.example`の活用

機密情報を含まないテンプレートを作成：

```bash
# .env.example（Gitにコミット可能）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@host:5432/db
APP_DOMAIN=http://localhost:3000
NEXT_PUBLIC_LOG_LEVEL=debug
STRIPE_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

新メンバーは`.env.example`をコピーして実際の値を入力：

```bash
cp .env.example .env.local
# .env.localを編集して実際の値を入力
```

## セキュリティチェックリスト

開発前:
- [ ] `.gitignore`に`.env.local`が含まれている
- [ ] `.env.example`が最新の変数構成を反映している

開発中:
- [ ] サーバーサイド専用変数をクライアントコードで使用していない
- [ ] ログに機密情報を出力していない
- [ ] コメントやドキュメントに実際のキーを記載していない

デプロイ前:
- [ ] 本番環境で`test`キーではなく`live`キーを使用している
- [ ] 本番Webhookが正しく設定されている
- [ ] 本番`NEXT_PUBLIC_LOG_LEVEL`が`error`または`warn`

定期チェック:
- [ ] 環境変数を定期的にローテーション
- [ ] 不要になった変数を削除
- [ ] アクセスログを監視
