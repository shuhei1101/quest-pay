(2026年3月記載)

# コメントAPI エンドポイント仕様

## 基本CRUD操作

### GET /api/quests/public/[id]/comments

**概要**: 公開クエストのコメント一覧を取得

**認証**: 必須

**パラメータ**:
- `id` (path): 公開クエストID (UUID)

**レスポンス**:
```typescript
{
  comments: Array<{
    id: string                      // コメントID
    publicQuestId: string          // 公開クエストID
    profileId: string              // 投稿者プロフィールID
    content: string                // コメント内容
    isPinned: boolean              // ピン留めフラグ
    isLikedByPublisher: boolean    // 公開者いいねフラグ
    createdAt: string              // 作成日時
    updatedAt: string              // 更新日時
    upvotesCount: number           // 高評価数
    downvotesCount: number         // 低評価数
    userVote: 'upvote' | 'downvote' | null  // ログインユーザの評価
    profile: {
      name: string                 // 投稿者名
      iconId: number               // アイコンID
      iconColor: string            // アイコンカラー
    }
  }>
}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/route.ts` (GET)
- Client: `app/api/quests/public/[id]/comments/client.ts` (getPublicQuestComments)
- Query: `app/api/quests/public/[id]/comments/query.ts` (fetchPublicQuestComments)

---

### POST /api/quests/public/[id]/comments

**概要**: 公開クエストにコメントを投稿

**認証**: 必須（親ユーザのみ）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)

**リクエストボディ**:
```typescript
{
  content: string  // コメント内容
}
```

**レスポンス**:
```typescript
{
  comment: {
    id: string
    publicQuestId: string
    profileId: string
    content: string
    isPinned: boolean
    isLikedByPublisher: boolean
    createdAt: string
    updatedAt: string
  }
}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/route.ts` (POST)
- Client: `app/api/quests/public/[id]/comments/client.ts` (postPublicQuestComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (createPublicQuestComment)

---

### PUT /api/quests/public/[id]/comments/[commentId]

**概要**: コメントを更新

**認証**: 必須（コメント投稿者のみ）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**リクエストボディ**:
```typescript
{
  content: string  // 更新後のコメント内容
}
```

**レスポンス**:
```typescript
{
  comment: {
    id: string
    publicQuestId: string
    profileId: string
    content: string
    isPinned: boolean
    isLikedByPublisher: boolean
    createdAt: string
    updatedAt: string
  }
}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: コメント投稿者以外のアクセス
- `404 Not Found`: コメントが存在しない
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/route.ts` (PUT)
- Client: `app/api/quests/public/[id]/comments/[commentId]/client.ts` (updatePublicQuestComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (updateComment)

---

### DELETE /api/quests/public/[id]/comments/[commentId]

**概要**: コメントを削除

**認証**: 必須（コメント投稿者のみ）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: コメント投稿者以外のアクセス
- `404 Not Found`: コメントが存在しない
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/route.ts` (DELETE)
- Client: `app/api/quests/public/[id]/comments/[commentId]/client.ts` (deletePublicQuestComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (deleteComment)

---

### GET /api/quests/public/[id]/comments/count

**概要**: コメント数を取得

**認証**: 必須

**パラメータ**:
- `id` (path): 公開クエストID (UUID)

**レスポンス**:
```typescript
{
  count: number  // コメント数
}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/count/route.ts` (GET)
- Client: `app/api/quests/public/[id]/comments/count/client.ts` (getPublicQuestCommentCount)
- Query: `app/api/quests/public/[id]/comments/query.ts` (fetchPublicQuestCommentCount)

---

## 評価機能

### POST /api/quests/public/[id]/comments/[commentId]/upvote

**概要**: コメントに高評価を付ける

**認証**: 必須（親ユーザのみ、自分のコメント以外）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス、または自分のコメントへの評価
- `404 Not Found`: コメントが存在しない
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/upvote/route.ts` (POST)
- Client: `app/api/quests/public/[id]/comments/[commentId]/upvote/client.ts` (upvoteComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (upvoteComment)

---

### DELETE /api/quests/public/[id]/comments/[commentId]/upvote

**概要**: コメントの高評価を取り消す

**認証**: 必須

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/upvote/route.ts` (DELETE)
- Client: `app/api/quests/public/[id]/comments/[commentId]/upvote/client.ts` (removeUpvote)
- Service: `app/api/quests/public/[id]/comments/service.ts` (removeCommentVote)

---

### POST /api/quests/public/[id]/comments/[commentId]/downvote

**概要**: コメントに低評価を付ける

**認証**: 必須（親ユーザのみ、自分のコメント以外）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス、または自分のコメントへの評価
- `404 Not Found`: コメントが存在しない
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/downvote/route.ts` (POST)
- Client: `app/api/quests/public/[id]/comments/[commentId]/downvote/client.ts` (downvoteComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (downvoteComment)

---

### DELETE /api/quests/public/[id]/comments/[commentId]/downvote

**概要**: コメントの低評価を取り消す

**認証**: 必須

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/downvote/route.ts` (DELETE)
- Client: `app/api/quests/public/[id]/comments/[commentId]/downvote/client.ts` (removeDownvote)
- Service: `app/api/quests/public/[id]/comments/service.ts` (removeCommentVote)

---

## モデレーション機能

### POST /api/quests/public/[id]/comments/[commentId]/report

**概要**: コメントを報告する

**認証**: 必須（親ユーザのみ）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**リクエストボディ**:
```typescript
{
  reason: string  // 報告理由
}
```

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/report/route.ts` (POST)
- Client: `app/api/quests/public/[id]/comments/[commentId]/report/client.ts` (reportComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (reportComment)

---

### POST /api/quests/public/[id]/comments/[commentId]/pin

**概要**: コメントをピン留めする（公開クエストの家族メンバーのみ）

**認証**: 必須（親ユーザ、かつ公開クエストの家族メンバー）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス、または家族メンバー以外のアクセス
- `404 Not Found`: コメントまたは公開クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/pin/route.ts` (POST)
- Client: `app/api/quests/public/[id]/comments/[commentId]/pin/client.ts` (pinComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (pinComment)

**注意**: 1つの公開クエストにつき1つのコメントのみピン留め可能。既存のピン留めは自動的に解除される。

---

### DELETE /api/quests/public/[id]/comments/[commentId]/pin

**概要**: コメントのピン留めを解除する

**認証**: 必須（親ユーザのみ）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/pin/route.ts` (DELETE)
- Client: `app/api/quests/public/[id]/comments/[commentId]/pin/client.ts` (unpinComment)
- Service: `app/api/quests/public/[id]/comments/service.ts` (unpinComment)

---

### POST /api/quests/public/[id]/comments/[commentId]/publisher-like

**概要**: 公開者としてコメントにいいねする（公開クエストの家族メンバーのみ）

**認証**: 必須（親ユーザ、かつ公開クエストの家族メンバー）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス、または家族メンバー以外のアクセス
- `404 Not Found`: コメントまたは公開クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/publisher-like/route.ts` (POST)
- Client: `app/api/quests/public/[id]/comments/[commentId]/publisher-like/client.ts` (likeCommentByPublisher)
- Service: `app/api/quests/public/[id]/comments/service.ts` (likeCommentByPublisher)

---

### DELETE /api/quests/public/[id]/comments/[commentId]/publisher-like

**概要**: 公開者のいいねを解除する

**認証**: 必須（親ユーザ、かつ公開クエストの家族メンバー）

**パラメータ**:
- `id` (path): 公開クエストID (UUID)
- `commentId` (path): コメントID (UUID)

**レスポンス**:
```typescript
{}
```

**エラー**:
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 親ユーザ以外のアクセス、または家族メンバー以外のアクセス
- `500 Internal Server Error`: サーバーエラー

**実装ファイル**:
- Route: `app/api/quests/public/[id]/comments/[commentId]/publisher-like/route.ts` (DELETE)
- Client: `app/api/quests/public/[id]/comments/[commentId]/publisher-like/client.ts` (unlikeCommentByPublisher)
- Service: `app/api/quests/public/[id]/comments/service.ts` (unlikeCommentByPublisher)

---

## 共通実装パターン

### 認証とプロフィール取得
すべてのエンドポイントで共通:
```typescript
const { db, userId } = await getAuthContext()
const userInfo = await fetchUserInfoByUserId({ userId, db })
if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")
```

### 親ユーザ検証
コメント投稿、評価、報告、ピン留めで必要:
```typescript
if (userInfo.profiles.type !== "parent") {
  throw new ServerError("親ユーザのみ操作できます。")
}
```

### 家族メンバー検証
ピン留めと公開者いいねで必要:
```typescript
const publicQuest = await fetchPublicQuest({ id: publicQuestId, db })
if (publicQuest.base.familyId !== userInfo.profiles.familyId) {
  throw new ServerError("この公開クエストの家族に所属していません。")
}
```

### 自己評価チェック
高評価・低評価で必要:
```typescript
const comment = await getCommentById({ commentId, db })
if (comment.profileId === userInfo.profiles.id) {
  throw new ServerError("自分のコメントには評価できません。")
}
```

### トランザクション
ピン留めで使用（既存ピン留め解除 + 新規ピン留め設定）:
```typescript
await db.transaction(async (tx) => {
  // 既存のピン留めを解除
  // 新規ピン留めを設定
})
```
