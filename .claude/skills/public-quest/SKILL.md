---
name: public-quest
description: '公開クエスト機能の知識を提供するスキル。公開クエストの閲覧・いいね・コメント・報告・有効化/無効化のAPI、一覧・詳細画面を含む。'
---

# 公開クエスト スキル

## 概要

公開クエストの一覧表示・詳細閲覧・いいね・コメント・通報・有効化/無効化を管理する機能。無限スクロールと楽観的更新を使用。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/public/route.ts`: 公開クエスト一覧 (GET)
- `packages/web/app/api/quests/public/[id]/route.ts`: 詳細取得 (GET)
- `packages/web/app/api/quests/public/[id]/like/route.ts`: いいね/取消 (POST/DELETE)
- `packages/web/app/api/quests/public/[id]/is-like/route.ts`: いいね状態確認 (GET)
- `packages/web/app/api/quests/public/[id]/pin/route.ts`: ピン留め (POST)
- `packages/web/app/api/quests/public/[id]/publisher-like/route.ts`: 投稿者いいね (POST)
- `packages/web/app/api/quests/public/[id]/report/route.ts`: 通報 (POST)
- `packages/web/app/api/quests/public/[id]/activate/route.ts`: 有効化 (POST)
- `packages/web/app/api/quests/public/[id]/deactivate/route.ts`: 無効化 (POST)
- `packages/web/app/api/quests/public/client.ts`: APIクライアント
- `packages/web/app/api/quests/public/query.ts`: React Queryフック

### 画面・コンポーネント（一覧）
- `packages/web/app/(app)/quests/public/page.tsx`: 公開クエスト一覧ページ
- `packages/web/app/(app)/quests/public/_components/PublicQuestsScreen.tsx`: 一覧画面
  - 検索・フィルター・ソート
  - 無限スクロール
  - いいねの楽観的更新

### 画面・コンポーネント（詳細）
- `packages/web/app/(app)/quests/public/[id]/page.tsx`: 詳細ページ
- `packages/web/app/(app)/quests/public/[id]/_components/PublicQuestView.tsx`: 詳細画面
  - コメントモーダル（85vh）
  - SubMenuFAB（いいね/コメント/家族採用/レベル）
  - `useDisclosure` でモーダル管理

## 主要機能

### 1. 公開クエスト一覧
- 検索（タイトル・説明）・フィルター（カテゴリ・レベル）・ソート（新着/人気）
- 無限スクロール（React Query `useInfiniteQuery`）
- いいねの楽観的更新

### 2. 公開クエスト詳細
- 3タブ: 条件/依頼情報/その他（共通コンポーネント）
- コメントモーダル（85vh高さ）
- FABで各種アクション

### 3. コメント機能
- コメント投稿・いいね・ピン留め・通報
- ソフトデリート

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/quests/public` | 一覧取得 |
| GET | `/api/quests/public/[id]` | 詳細取得 |
| POST | `/api/quests/public/[id]/like` | いいね |
| DELETE | `/api/quests/public/[id]/like` | いいね取消 |
| POST | `/api/quests/public/[id]/report` | 通報 |
| POST | `/api/quests/public/[id]/activate` | 有効化 |
| POST | `/api/quests/public/[id]/deactivate` | 無効化 |

## 実装上の注意点

- いいね数・コメント数はカウンターキャッシュ（インクリメント方式）
- コメントはソフトデリート（deleted_at 使用）
- 無限スクロールはカーソルベースページネーション
