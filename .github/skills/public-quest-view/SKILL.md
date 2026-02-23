---
name: public-quest-view
description: 公開クエスト閲覧画面の構造知識を提供するスキル。表示内容、いいね・コメントモーダル機能を含む。
---

# 公開クエスト閲覧 スキル

## 概要

公開クエスト閲覧画面は、特定の公開クエストの詳細情報を表示する画面。いいね、コメント（モーダル）、レベル選択機能を提供。

## ファイル構成

### メインファイル
- `app/(app)/quests/public/[id]/view/page.tsx`: 公開クエスト詳細ページ（リダイレクト）
- `app/(app)/quests/public/[id]/view/PublicQuestView.tsx`: 閲覧画面実装（FAB管理）
- `app/(app)/quests/public/[id]/view/_components/PublicQuestViewLayout.tsx`: クエスト表示レイアウト

### コメント関連ファイル
- `app/(app)/quests/public/[id]/comments/PublicQuestComments.tsx`: コメントモーダル実装（ビジネスロジック）
- `app/(app)/quests/public/[id]/comments/_components/CommentsModalLayout.tsx`: コメントモーダルレイアウト
- `app/(app)/quests/public/[id]/comments/_components/CommentsLayout.tsx`: コメント一覧 + 入力欄レイアウト
- `app/(app)/quests/public/[id]/comments/_components/CommentItemLayout.tsx`: 個別コメントアイテム

### フック
- `app/(app)/quests/public/[id]/view/_hooks/usePublicQuest.ts`: 公開クエストデータ取得
- `app/(app)/quests/public/[id]/view/_hooks/useLikeQuest.ts`: いいね操作
- `app/(app)/quests/public/[id]/view/_hooks/useCancelQuestLike.ts`: いいね解除
- `app/(app)/quests/public/[id]/view/_hooks/useLikeCount.ts`: いいね数取得
- `app/(app)/quests/public/[id]/view/_hooks/useIsLike.ts`: いいね状態確認
- `app/(app)/quests/public/[id]/comments/_hooks/useCommentsCount.ts`: コメント数取得
- `app/(app)/quests/public/[id]/comments/_hooks/usePublicQuestComments.ts`: コメント一覧取得
- `app/(app)/quests/public/[id]/comments/_hooks/usePostComment.ts`: コメント投稿
- `app/(app)/quests/public/[id]/comments/_hooks/useUpvoteComment.ts`: 高評価
- `app/(app)/quests/public/[id]/comments/_hooks/useDownvoteComment.ts`: 低評価
- `app/(app)/quests/public/[id]/comments/_hooks/useReportComment.ts`: コメント報告
- `app/(app)/quests/public/[id]/comments/_hooks/useDeleteComment.ts`: コメント削除
- `app/(app)/quests/public/[id]/comments/_hooks/usePinComment.ts`: ピン留め
- `app/(app)/quests/public/[id]/comments/_hooks/usePublisherLike.ts`: 公開者いいね

## 主要コンポーネント

### PublicQuestView
**責務:** FAB管理、モーダル開閉状態管理、レベル選択

**主要機能:**
- FloatingActionButton（FAB）の制御
  - 戻るボタン
  - いいねボタン（バッジ付きいいね数）
  - **コメントボタン（バッジ付きコメント数）** ← モーダル起動
  - 家族ボタン
  - レベルボタン（複数レベルがある場合のみ）
- レベル選択メニュー（ポップアップ）
- いいね・いいね解除処理
- **コメントモーダルの開閉制御**
- 編集モーダル（公開者のみ）

**Props:**
```typescript
{
  id: string  // 公開クエストID
}
```

**State:**
- `selectedLevel`: 選択中のレベル
- `levelMenuOpened`: レベル選択メニューの開閉状態
- `editModalOpened`: 編集モーダルの開閉状態
- **`commentModalOpened`**: コメントモーダルの開閉状態

### PublicQuestViewLayout
**責務:** クエスト詳細情報の表示（タブ切り替え）

**主要機能:**
- クエスト詳細3タブ表示
  - クエスト条件タブ
  - 依頼情報タブ
  - その他タブ
- ヘッダー表示（名前、アイコン）
- ローディング表示

**Props:**
```typescript
{
  questName: string
  headerColor?: { light: string, dark: string }
  backgroundColor: { light: string, dark: string }
  iconName?: string
  iconSize?: number
  iconColor?: string
  isLoading: boolean
  level: number
  category: string
  successCondition: string
  reward: number
  exp: number
  requiredCompletionCount: number
  client: string
  requestDetail: string
  tags: string[]
  ageFrom?: number | null
  ageTo?: number | null
  monthFrom?: number | null
  monthTo?: number | null
  requiredClearCount: number | null
}
```

**注意:**
- **コメントタブは削除済み**（モーダル化による）
- `commentCount`, `publicQuestId` propsは不要

### PublicQuestComments
**責務:** コメントモーダルのビジネスロジック

**主要機能:**
- コメント一覧データ取得
- コメント投稿
- 高評価・低評価
- 報告・削除
- ピン留め
- 公開者いいね
- ソート方法管理（newest/likes）
- CommentsModalLayoutでラップして表示

**Props:**
```typescript
{
  id: string           // 公開クエストID
  opened: boolean      // モーダルの開閉状態
  onClose: () => void  // モーダルを閉じる関数
}
```

**内部State:**
- `comment`: コメント入力内容
- `sortType`: ソート方法（"newest" | "likes"）

**構成:**
```tsx
<CommentsModalLayout
  isDark={isDark}
  opened={opened}
  onClose={onClose}
  sortType={sortType}
  onSortChange={setSortType}
>
  <CommentsLayout
    comments={comments}
    // ... その他のprops
    comment={comment}
    onCommentChange={setComment}
    onSubmit={handleSubmit}
    isPostingComment={isPostingComment}
  />
</CommentsModalLayout>
```

### CommentsModalLayout
**責務:** モーダルのプレゼンテーション層

**主要機能:**
- Modalコンポーネントのラップ
- タイトルバーにソート選択を配置
- 高さ85vh、オーバーフロー制御
- 背景色設定

**Props:**
```typescript
{
  isDark: boolean
  opened: boolean
  onClose: () => void
  sortType: "newest" | "likes"
  onSortChange: (value: "newest" | "likes") => void
  children: ReactNode
}
```

**スタイリング:**
- `Modal.content`: height 85vh, overflow hidden
- `Modal.body`: height 100%, overflow hidden, flex column, padding 0
- 内部Box: background color, flex column

### CommentsLayout
**責務:** コメント一覧と入力欄のレイアウト

**主要機能:**
- コメント一覧表示（スクロール可能）
- コメント入力欄（下部固定）
- ピン留めコメントを最上位に表示
- ローディングオーバーレイ

**Props:**
```typescript
{
  comments: CommentItem[] | undefined
  isDark: boolean
  isLoading: boolean
  isQuestCreator: (familyId: string) => boolean
  hasLiked: (familyId: string) => boolean
  isPublisherFamily: boolean
  isCurrentUser: (profileId: string) => boolean
  onUpvote: (commentId: string) => void
  onDownvote: (commentId: string) => void
  onReport: (commentId: string) => void
  onDelete: (commentId: string) => void
  onPin: (commentId: string, isPinned: boolean) => void
  onPublisherLike: (commentId: string, isLiked: boolean) => void
  comment: string
  onCommentChange: (value: string) => void
  onSubmit: () => void
  isPostingComment: boolean
}
```

**レイアウト構造:**
```
外側Box (height 100%, flex column)
  ├── スクロールエリア (flex 1, overflow auto, padding 1rem)
  │   └── コメント一覧 (Stack)
  └── 入力エリア (flexShrink 0, borderTop, padding 1rem)
      └── Textarea + Button (Group)
```

## 処理フロー

### 初期表示フロー
1. PublicQuestView がマウント
2. usePublicQuest でクエスト詳細を取得
3. useLikeCount でいいね数を取得
4. useIsLike でいいね状態を取得
5. useCommentsCount でコメント数を取得
6. PublicQuestViewLayout でクエスト詳細を表示
7. FAB を開く（openFab("public-quest-fab")）

### コメント表示フロー
1. ユーザーがFABのコメントボタンをクリック
2. `openCommentModal()` が実行される
3. `commentModalOpened` が `true` になる
4. PublicQuestComments コンポーネントがレンダリング
5. CommentsModalLayout が Modal を表示（85vh）
6. CommentsLayout がコメント一覧 + 入力欄を表示

### コメント投稿フロー
1. ユーザーがコメントを入力
2. 投稿ボタンをクリック
3. handleSubmit が実行される
4. usePostComment でコメントを投稿
5. 成功時、コメント内容をクリア
6. refetch() でコメント一覧を再取得

### いいね操作フロー
1. ユーザーがFABのいいねボタンをクリック
2. `likeToggleHandle()` が実行される
3. `isLike` 状態に応じて:
   - いいね済み → useCancelQuestLike で解除
   - 未いいね → useLikeQuest でいいね
4. いいね数とアイコンが自動更新

### レベル選択フロー
1. ユーザーがFABのレベルボタンをクリック（複数レベルがある場合のみ）
2. FABを閉じる（closeFab）
3. レベル選択メニューを開く（setLevelMenuOpened(true)）
4. ユーザーがレベルを選択
5. `handleLevelChange(level)` が実行される
6. 選択レベルの詳細が表示される

## コンポーネント階層

```
PublicQuestView
  ├── PublicQuestViewLayout (クエスト詳細表示)
  ├── FloatingActionButton (FAB)
  │   ├── 戻るボタン
  │   ├── いいねボタン（バッジ: いいね数）
  │   ├── コメントボタン（バッジ: コメント数） ← openCommentModal
  │   ├── 家族ボタン
  │   └── レベルボタン（条件付き）
  ├── レベル選択メニュー（Paper）
  ├── QuestEditModal（公開者のみ）
  └── PublicQuestComments（モーダル）
        └── CommentsModalLayout
              ├── Modal（title: "コメント" + ソート選択）
              └── CommentsLayout
                    ├── スクロールエリア（コメント一覧）
                    └── 入力エリア（Textarea + Button）
```

## 注意点

### コメント機能
- **コメントはモーダルで表示**（タブから分離）
- モーダル高さ85vh、スクロールはコメント一覧のみ
- 入力欄は下部に固定
- ソート機能はモーダルタイトルバーに配置

### FAB
- FABは常時表示
- コメント数バッジは動的に更新
- いいね数バッジは動的に更新
- レベルボタンは複数レベルがある場合のみ表示

### レベル機能
- 複数レベルがある場合、レベル選択可能
- 選択レベルに応じてクエスト詳細が変わる
- レベル選択メニューはFABの上に表示（fixed position）

### 認証
- 閲覧は認証なしで可能
- いいね・コメントは認証必須
- 編集は公開者のみ可能

### スクロール制御
- PublicQuestViewLayout: 全体スクロール可能
- CommentsModalLayout: overflow hidden
- CommentsLayout: コメント一覧のみスクロール、入力欄は固定
