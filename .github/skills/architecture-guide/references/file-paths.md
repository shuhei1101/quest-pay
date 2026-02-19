# よく使うファイルパス

以下は、開発時に頻繁に参照するファイルとディレクトリの一覧。

## データベース関連

| パス | 説明 |
|------|------|
| `packages/web/drizzle/schema.ts` | DBスキーマ定義（Drizzle ORM） |
| `packages/web/supabase/migrations/` | Supabaseマイグレーションファイル |

## コア機能

| パス | 説明 |
|------|------|
| `packages/web/app/(core)/endpoints.ts` | APIや画面のエンドポイントを定義する |
| `packages/web/app/(core)/schema.ts` | Zodスキーマ定義 |
| `packages/web/app/(core)/_sessionStorage/appStorage.ts` | セッションストレージをキーバリュー形式で定義 |
| `packages/web/app/(core)/_supabase/` | Supabase接続設定 |
| `packages/web/app/(core)/_auth/` | 認証関連のユーティリティ |
| `packages/web/app/(core)/_components/` | 共通コンポーネント |
| `packages/web/app/(core)/_hooks/` | 共通フック |

## 画面構成

| パス | 説明 |
|------|------|
| `packages/web/app/(app)/` | アプリケーションメイン画面（認証後） |
| `packages/web/app/(app)/_components/SideMenu.tsx` | サイドバー サイドメニュー |
| `packages/web/app/(app)/_components/BottomBar.tsx` | モバイル時のフッター |
| `packages/web/app/(auth)/` | 認証画面（ログイン、サインアップなど） |

## クエスト関連

| パス | 説明 |
|------|------|
| `packages/web/app/(app)/quests/family/` | 家族クエスト一覧・詳細画面 |
| `packages/web/app/(app)/quests/public/` | 公開クエスト一覧・詳細画面 |

## 家族管理

| パス | 説明 |
|------|------|
| `packages/web/app/(app)/families/` | 家族情報管理画面 |
| `packages/web/app/(app)/children/` | 子供情報管理画面 |
| `packages/web/app/(app)/parents/` | 親情報管理画面 |

## その他

| パス | 説明 |
|------|------|
| `packages/web/app/(app)/home/` | ホーム画面 |
| `packages/web/app/(app)/timeline/` | タイムライン画面 |
| `packages/web/app/(app)/notifications/` | 通知画面 |
| `packages/web/app/(app)/reward/` | 報酬管理画面 |
| `packages/web/app/(app)/icons/` | アイコン管理画面 |
| `packages/web/tmp/` | 仮ファイル置き場（gitignore対象） |

## API構成パターン

各機能は以下のようなファイル構成を持つ:

```
app/api/[feature]/
├── client.ts          # APIクライアント（フロントから呼び出し）
├── route.ts           # APIルート（Next.js API Routes）
├── service.ts         # ビジネスロジック（トランザクション含む）
├── query.ts           # DB読み取りクエリ
└── db.ts              # DB更新操作
```
