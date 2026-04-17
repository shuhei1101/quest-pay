
# コメント スキル

## 概要

公開クエストへのコメント投稿・一覧表示・モデレーション（いいね/逆いいね/ピン留め/報告）を管理する機能。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/public/[id]/comments/route.ts`: コメント一覧取得・投稿 (GET/POST)
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/upvote/route.ts`: 賛成票
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/downvote/route.ts`: 反対票
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/pin/route.ts`: ピン留め
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/publisher-like/route.ts`: 投稿者いいね
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/report/route.ts`: 通報

### 画面・コンポーネント
- `packages/web/app/(app)/quests/public/[id]/_components/CommentsScreen.tsx`: コメント画面
- `packages/web/app/(app)/quests/public/[id]/_components/CommentList.tsx`: コメントリスト
- `packages/web/app/(app)/quests/public/[id]/_components/CommentItem.tsx`: コメントアイテム
- `packages/web/app/(app)/quests/public/[id]/_components/PublicQuestComments.tsx`: コメント投稿UI
- `packages/web/app/(app)/quests/public/[id]/_components/CommentsModalLayout.tsx`: モーダルレイアウト（85vh）

### フック
- `packages/web/app/(app)/quests/public/[id]/_hooks/useComments.ts`: コメント一覧・楽観的更新
- `packages/web/app/(app)/quests/public/[id]/_hooks/usePostComment.ts`: コメント投稿

## 主要機能

### 1. コメント一覧
- 公開クエスト詳細のモーダル内（85vh）に表示
- 楽観的更新（Optimistic Update）で即時反映
- ピン留めコメントは最上部に表示

### 2. コメント投稿
- 最大1000文字制限
- 空白のみのコメント禁止
- `usePostComment` フックで送信処理

### 3. モデレーション
- 賛成/反対票（upvote/downvote）
- ピン留め（投稿者のみ）
- 投稿者いいね（publisher-like）
- 通報（report）

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/quests/public/[id]/comments` | コメント一覧取得 |
| POST | `/api/quests/public/[id]/comments` | コメント投稿 |
| POST | `/api/quests/public/[id]/comments/[commentId]/upvote` | 賛成票 |
| POST | `/api/quests/public/[id]/comments/[commentId]/downvote` | 反対票 |
| POST | `/api/quests/public/[id]/comments/[commentId]/pin` | ピン留め |
| DELETE | `/api/quests/public/[id]/comments/[commentId]` | コメント削除（ソフトデリート） |

## 実装上の注意点

- コメント削除はソフトデリート（deleted_at カラムを使用）
- カウンターキャッシュ（likes_count, comments_count）はインクリメント方式
- コメントモーダルは `useDisclosure` で管理
