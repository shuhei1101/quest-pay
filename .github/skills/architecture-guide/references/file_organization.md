(2026年3月記載)

# ファイル構成ガイド

## よく使うファイルパス

### データベース
- **スキーマ定義**: `packages/web/drizzle/schema.ts`
- **マイグレーション**: `packages/web/supabase/migrations/`

### API
- **エンドポイント定義**: `packages/web/app/(core)/endpoints.ts`
- **API routes**: `packages/web/app/api/`
- **DB Helper**: `packages/web/app/api/_db_helper/db_helper.ts`

### フロントエンド
- **コア機能**: `packages/web/app/(core)/`
- **共通コンポーネント**: `packages/web/app/(core)/_components/`
- **Supabase設定**: `packages/web/app/(core)/_supabase/`

### 画面
- **アプリ画面**: `packages/web/app/(app)/`
- **認証画面**: `packages/web/app/(auth)/`
- **エラー画面**: `packages/web/app/error/`

## ディレクトリ構造のパターン

### API機能ディレクトリ
```
app/api/quests/family/
├── client.ts          # APIクライアント
├── route.ts           # APIルート（GET, POST）
├── query.ts           # 読み取りクエリ
├── db.ts              # 単一テーブル更新
├── service.ts         # トランザクション処理
└── [id]/
    ├── route.ts       # 詳細API（GET, PUT, DELETE）
    └── ...
```

### 画面機能ディレクトリ
```
app/(app)/quests/
├── page.tsx           # ルーティング
├── QuestsScreen.tsx   # 画面実装
├── QuestsLayout.tsx   # レイアウト
├── useQuests.ts       # カスタムフック
└── _components/       # 画面専用コンポーネント
    ├── QuestCard.tsx
    └── QuestFilter.tsx
```

## ファイル命名規則

### コンポーネント
- **画面**: `XxxScreen.tsx`
- **レイアウト**: `XxxLayout.tsx`
- **閲覧画面**: `XxxView.tsx`
- **編集画面**: `XxxEdit.tsx`

### API
- **クライアント**: `client.ts`
- **ルート**: `route.ts`
- **サービス**: `service.ts`
- **クエリ**: `query.ts`
- **DB**: `db.ts`

### フック
- **カスタムフック**: `useXxx.ts`
- **React Query**: `query.ts` (APIディレクトリ内)

## モジュール配置ルール

### 共通コンポーネント
- **場所**: `app/(core)/_components/`
- **条件**: 複数の画面で使用される場合のみ
- **例外**: 画面固有のコンポーネントは`_components/`に配置

### 共通ユーティリティ
- **場所**: `app/(core)/`
- **種類**: 
  - `_supabase/`: DB接続設定
  - `endpoints.ts`: エンドポイント定義
  - `_components/`: グローバルコンポーネント

### 仮ファイル
- **場所**: `tmp/`ディレクトリ
- **用途**: テストコード、一時的なスクリプト
- **注意**: `tmp/`内のファイルはgit管理対象外

## index.ts の使用

### 基本方針
- **原則**: 極力作成しないこと
- **理由**: 暗黙的なimportパスは混乱を招く
- **例外**: 明確な理由がある場合のみ作成

### 例外ケース
- 大量のエクスポートを整理する必要がある場合
- ライブラリのような公開APIを提供する場合
