# コメント一覧 - コンポーネント構造

**2026年3月記載**

## 概要

コメント一覧は、公開クエストに投稿されたコメントを表示し、評価・報告機能を提供する画面です。

## レイアウト構造

### メインスクリーン
```
CommentsScreen（公開クエスト詳細配下）
  ├─ PageHeader（タイトル）
  └─ CommentList
       ├─ CommentItem（ピン留めコメント）
       ├─ CommentItem × N（通常コメント）
       └─ CommentActions（評価・報告）
```

### ファイル構成
- `app/(app)/quests/public/[id]/comments/page.tsx`: コメントページ
- `app/(app)/quests/public/[id]/comments/CommentsScreen.tsx`: メイン画面
- `app/(app)/quests/public/_components/CommentList.tsx`: コメント一覧
- `app/(app)/quests/public/_components/CommentItem.tsx`: コメントアイテム
- `app/(app)/quests/public/_components/CommentActions.tsx`: コメントアクション
- `app/(app)/quests/public/_hooks/useComments.ts`: データ取得フック

## コンポーネント詳細

### CommentsScreen
**責務:** コメント一覧のトップレベルコンポーネント

**主要機能:**
- ページヘッダー表示
- CommentList コンポーネントの配置
- 公開クエストIDの管理

### CommentList
**責務:** コメントの一覧表示と評価管理

**主要機能:**
- ピン留めコメントの優先表示
- 通常コメントの表示
- 評価機能（高評価・低評価）
- 公開者いいね表示
- 不適切コメント報告
- 削除機能（自分のコメントのみ）

**表示ルール:**
1. ピン留めコメントを最上部に表示
2. 通常コメントは投稿日時順（新しい順）
3. 自分のコメントには評価ボタンを表示しない
4. 自分のコメントには報告ボタンを表示しない
5. 自分のコメントには削除ボタンを表示

**Props:**
```typescript
type CommentListProps = {
  publicQuestId: string
}
```

### CommentItem
**責務:** 個別コメントの表示

**表示項目:**
- コメント投稿者名
- コメント内容
- 投稿日時
- 高評価数
- 低評価数
- ピン留めバッジ（該当する場合）
- 公開者いいねバッジ（該当する場合）

**主要Props:**
```typescript
type CommentItemProps = {
  comment: Comment
  isPinned: boolean
  hasCreatorLike: boolean
  currentUserId?: string
}
```

### CommentActions
**責務:** コメントへのアクション（評価・報告・削除）

**アクション:**
- 高評価（👍）
- 低評価（👎）
- 不適切コメント報告
- 削除（自分のコメントのみ）

**表示制御:**
```typescript
// 自分のコメントには評価・報告を表示しない
const isMyComment = comment.userId === currentUserId

if (isMyComment) {
  // 削除ボタンのみ表示
} else {
  // 評価・報告ボタンを表示
}
```

**主要Props:**
```typescript
type CommentActionsProps = {
  comment: Comment
  currentUserId?: string
  onLike: (commentId: string) => void
  onDislike: (commentId: string) => void
  onReport: (commentId: string) => void
  onDelete: (commentId: string) => void
}
```

## リストレイアウト

### 縦スクロールレイアウト
- コメントを縦に並べて表示
- ピン留めコメントは背景色を変えて強調
- 無限スクロールまたはページネーション（実装状況に応じて）

### アクション配置
- 各コメントの下部にアクションボタンを配置
- 高評価・低評価のカウント表示
- 自分がすでに評価済みの場合はボタンの色変更

## フィルター機能

現在、フィルター機能は実装されていません。すべてのコメントを表示します。

## ソート機能

### デフォルトソート
- ピン留めコメント → 最上部
- 通常コメント → 投稿日時順（新しい順）

### カスタムソート
現在、カスタムソート機能は実装されていません。

## ピン留め機能

### ピン留めルール
- 公開クエストの作成者（公開者）のみがピン留め可能
- ピン留めされたコメントは最上部に表示
- 複数コメントのピン留めが可能（実装状況に応じて）

### 表示
- ピン留めバッジ（📌）を表示
- 背景色を変えて強調

## 公開者いいね機能

### いいねルール
- 公開クエストの作成者（公開者）のみがいいね可能
- いいねされたコメントに公開者いいねバッジを表示
- 一般ユーザーの高評価とは別扱い

### 表示
- 公開者いいねバッジ（❤️ または ⭐）を表示
