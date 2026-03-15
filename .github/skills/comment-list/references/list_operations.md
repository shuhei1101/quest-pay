# コメント一覧 - リスト操作

**2026年3月記載**

## 概要

コメント一覧画面で実行可能な操作とナビゲーションパターンを説明します。

## CRUD操作

### Create（作成）

**トリガー:** コメント入力フォームで「投稿」ボタンクリック

**API:** `POST /api/quests/public/[publicQuestId]/comments`

**リクエスト:**
```typescript
type CreateCommentRequest = {
  content: string
}
```

**処理フロー:**
1. コメント入力
2. バリデーション（空白チェック、文字数チェック）
3. API呼び出し
4. 成功時に`refetch()`
5. 新しいコメントを含む一覧を表示

**バリデーション:**
- content: 必須、1文字以上500文字以内

**権限:** 認証済みユーザー

### Read（読み取り）

**トリガー:** ページマウント、手動リフレッシュ

**API:** `GET /api/quests/public/[publicQuestId]/comments`

**レスポンス:**
```typescript
type GetCommentsResponse = {
  comments: Comment[]
  pinnedComments: Comment[]
}
```

**処理フロー:**
1. useComments フック実行
2. API呼び出し
3. データ取得
4. CommentList のレンダリング

**権限:** すべてのユーザー（閲覧のみ）

### Update（更新）

現在、コメントの編集機能は実装されていません。

### Delete（削除）

**トリガー:** 自分のコメントの「削除」ボタンクリック

**API:** `DELETE /api/quests/public/[publicQuestId]/comments/[commentId]`

**処理フロー:**
1. 確認ダイアログ表示
2. 確認後にAPI呼び出し
3. 成功時に`refetch()`
4. 削除されたコメントを除く一覧を表示

**権限:** コメント作成者のみ

## 評価操作

### 高評価（いいね）

**トリガー:** 「👍」ボタンクリック

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/like`

**処理フロー:**
1. バリデーション（自分のコメントでないこと）
2. 楽観的更新（likeCount +1）
3. API呼び出し
4. DB に comment_like レコード作成
5. 成功時に`refetch()`または`invalidateQueries`
6. 最新の評価数を表示

**制約:**
- 自分のコメントには評価不可
- 1ユーザー1コメントにつき1評価
- 既に評価済みの場合は取り消しフローへ

**権限:** 認証済みユーザー（コメント作成者を除く）

### 低評価（よくないね）

**トリガー:** 「👎」ボタンクリック

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/dislike`

**処理フロー:**
1. バリデーション（自分のコメントでないこと）
2. 楽観的更新（dislikeCount +1）
3. API呼び出し
4. DB に comment_like レコード作成
5. 成功時に`refetch()`または`invalidateQueries`
6. 最新の評価数を表示

**制約:**
- 自分のコメントには評価不可
- 1ユーザー1コメントにつき1評価
- 既に評価済みの場合は取り消しフローへ

**権限:** 認証済みユーザー（コメント作成者を除く）

### 評価取り消し

**トリガー:** 既に評価したボタンを再度クリック

**API:** `DELETE /api/quests/public/[publicQuestId]/comments/[commentId]/like`

**処理フロー:**
1. 楽観的更新（評価数 -1）
2. API呼び出し
3. DB の comment_like レコード削除
4. 成功時に`refetch()`または`invalidateQueries`
5. 最新の評価数を表示

**権限:** 認証済みユーザー

## ピン留め操作

### ピン留め

**トリガー:** 公開者が「📌」ボタンクリック

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/pin`

**処理フロー:**
1. バリデーション（公開者であること）
2. API呼び出し
3. DB の comments.isPinned を true に更新
4. 成功時に`refetch()`
5. ピン留めコメントが最上部に移動

**権限:** 公開クエストの作成者（公開者）のみ

### ピン留め解除

**トリガー:** 公開者が「ピン留め解除」ボタンクリック

**API:** `DELETE /api/quests/public/[publicQuestId]/comments/[commentId]/pin`

**処理フロー:**
1. バリデーション（公開者であること）
2. API呼び出し
3. DB の comments.isPinned を false に更新
4. 成功時に`refetch()`
5. コメントが通常の位置に移動

**権限:** 公開クエストの作成者（公開者）のみ

## 公開者いいね操作

### 公開者いいね

**トリガー:** 公開者が「❤️」または「⭐」ボタンクリック

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/creator-like`

**処理フロー:**
1. バリデーション（公開者であること）
2. API呼び出し
3. DB の comments.hasCreatorLike を true に更新
4. 成功時に`refetch()`
5. 公開者いいねバッジを表示

**権限:** 公開クエストの作成者（公開者）のみ

### 公開者いいね取り消し

**トリガー:** 公開者が既にいいねしたボタンを再度クリック

**API:** `DELETE /api/quests/public/[publicQuestId]/comments/[commentId]/creator-like`

**処理フロー:**
1. バリデーション（公開者であること）
2. API呼び出し
3. DB の comments.hasCreatorLike を false に更新
4. 成功時に`refetch()`
5. 公開者いいねバッジを削除

**権限:** 公開クエストの作成者（公開者）のみ

## 報告操作

### 不適切コメント報告

**トリガー:** 「報告」ボタンクリック（自分のコメント以外）

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/report`

**リクエスト:**
```typescript
type ReportCommentRequest = {
  reason: "spam" | "inappropriate" | "harassment" | "other"
  details?: string
}
```

**処理フロー:**
1. 報告理由選択ダイアログ表示
2. 理由を選択
3. API呼び出し
4. DB に comment_report レコード作成
5. 成功メッセージ表示
6. 管理者によるモデレーション待ち

**制約:**
- 自分のコメントは報告不可
- 1ユーザー1コメントにつき1報告
- 重複報告は無視される

**権限:** 認証済みユーザー（コメント作成者を除く）

## ナビゲーションパターン

### 公開クエスト詳細への遷移

**トリガー:** ヘッダーの戻るボタンクリック

**遷移先:** `/quests/public/[publicQuestId]`

### ユーザープロフィールへの遷移

**トリガー:** コメント投稿者名クリック

**遷移先:** `/users/[userId]/profile`

**用途:**
- ユーザー情報表示
- ユーザーの他のコメント表示

## リアルタイム更新

### 自動再取得
- 他の画面から戻った際に`refetchOnMount: "always"`により自動再取得
- コメント投稿後は自動再取得
- 評価・ピン留め・削除後は自動再取得

### 手動リフレッシュ
```typescript
const { refetch } = useComments(publicQuestId)

// 手動リフレッシュ
await refetch()
```

## 楽観的更新

### 評価の楽観的更新
```typescript
// 高評価時
onMutate: async (commentId) => {
  await queryClient.cancelQueries(["comments", publicQuestId])
  const previousComments = queryClient.getQueryData(["comments", publicQuestId])
  
  queryClient.setQueryData(["comments", publicQuestId], (old: any) => ({
    ...old,
    comments: old.comments.map((c: Comment) =>
      c.id === commentId ? { ...c, likeCount: c.likeCount + 1 } : c
    )
  }))
  
  return { previousComments }
}
```

## 操作権限

### すべてのユーザー
- コメント閲覧

### 認証済みユーザー
- コメント投稿
- 他人のコメントへの評価（高評価・低評価）
- 他人のコメントの報告
- 自分のコメントの削除

### 公開クエスト作成者（公開者）
- 認証済みユーザーの権限 + 以下
  - コメントのピン留め・解除
  - 公開者いいね

## エラーケース

### コメント投稿時エラー
- 空白コメント → バリデーションエラー
- 文字数超過 → バリデーションエラー
- 認証エラー → ログイン画面へリダイレクト

### 評価時エラー
- 自分のコメント → エラー（ボタン非表示）
- 未認証 → ログイン画面へリダイレクト

### 削除時エラー
- 他人のコメント → 権限エラー
- 存在しないコメント → 404エラー

### 報告時エラー
- 自分のコメント → エラー（ボタン非表示）
- 重複報告 → 無視（エラーなし）
