(2026年3月15日 14:30記載)

# 公開クエストAPI エンドポイント詳細

## ファイル構成

```
packages/web/app/api/quests/public/
├── route.ts                        # GET（一覧）
├── client.ts                       # APIクライアント
├── query.ts                        # React Queryフック
└── [id]/
    ├── route.ts                    # GET（詳細）
    ├── like/
    │   ├── route.ts                # POST（いいね）
    │   └── cancel/
    │       └── route.ts            # POST（いいね解除）
    ├── comments/
    │   ├── route.ts                # GET（一覧）、POST（投稿）
    │   └── [commentId]/
    │       ├── route.ts            # PUT（編集）、DELETE（削除）
    │       ├── upvote/
    │       │   └── route.ts        # POST（高評価）
    │       ├── downvote/
    │       │   └── route.ts        # POST（低評価）
    │       ├── report/
    │       │   └── route.ts        # POST（報告）
    │       ├── pin/
    │       │   └── route.ts        # POST（ピン留め）
    │       └── publisher-like/
    │           └── route.ts        # POST（公開者いいね）
    ├── activate/
    │   └── route.ts                # POST（再公開）
    └── deactivate/
        └── route.ts                # POST（非公開化）
```

## 基本取得操作

### GET /api/quests/public

**概要**: 公開クエスト一覧を取得

**認証**: 任意（未認証でも取得可能）

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| limit | number | No | 取得件数（デフォルト: 20、最大: 100） |
| offset | number | No | オフセット（デフォルト: 0） |
| categoryId | number | No | カテゴリフィルタ |
| sortBy | string | No | ソート順（`likes`（デフォルト）、`newest`、`comments`） |
| search | string | No | タイトル・説明文の部分一致検索 |

**Request Example**:
```http
GET /api/quests/public?limit=10&offset=0&categoryId=1&sortBy=likes
```

**Response (200 OK)**:
```typescript
{
  quests: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      familyQuestId: "550e8400-e29b-41d4-a716-446655440002",
      title: "お部屋の片付け",
      description: "自分の部屋を綺麗に片付ける",
      categoryId: 1,
      categoryName: "掃除",
      iconId: 42,
      iconColor: "#FF5733",
      levels: [
        { level: 1, reward: 50 },
        { level: 2, reward: 70 },
        { level: 3, reward: 100 }
      ],
      likesCount: 42,
      commentsCount: 10,
      isActive: true,
      publisherFamily: {
        displayId: "family_001",
        onlineName: "山田家",
        iconId: 5
      },
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    ...
  ],
  total: 150
}
```

**Errors**:
- `400 Bad Request`: 不正なクエリパラメータ

---

### GET /api/quests/public/:id

**概要**: 公開クエスト詳細を取得

**認証**: 任意（ログイン時はいいね状態を含む）

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Request Example**:
```http
GET /api/quests/public/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  quest: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    familyId: "550e8400-e29b-41d4-a716-446655440000",
    familyQuestId: "550e8400-e29b-41d4-a716-446655440002",
    title: "お部屋の片付け",
    description: "自分の部屋を綺麗に片付ける",
    categoryId: 1,
    categoryName: "掃除",
    iconId: 42,
    iconColor: "#FF5733",
    levels: [
      { level: 1, reward: 50 },
      { level: 2, reward: 70 },
      { level: 3, reward: 100 }
    ],
    likesCount: 42,
    commentsCount: 10,
    isActive: true,
    publisherFamily: {
      displayId: "family_001",
      onlineName: "山田家",
      iconId: 5
    },
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z"
  },
  isLiked: true  // 認証時のみ
}
```

**Errors**:
- `404 Not Found`: クエストが存在しないor非公開

---

## いいね機能

### POST /api/quests/public/:id/like

**概要**: 公開クエストにいいねを付ける

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/like
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  likesCount: 43,
  isLiked: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: クエストが存在しない
- `409 Conflict`: 既にいいね済み

---

### POST /api/quests/public/:id/like/cancel

**概要**: 公開クエストのいいねを解除

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/like/cancel
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  likesCount: 42,
  isLiked: false
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: いいね記録が存在しない

---

## コメント機能

### GET /api/quests/public/:id/comments

**概要**: 公開クエストのコメント一覧を取得

**認証**: 任意

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| limit | number | No | 取得件数（デフォルト: 20、最大: 100） |
| offset | number | No | オフセット（デフォルト: 0） |

**Request Example**:
```http
GET /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments?limit=20&offset=0
```

**Response (200 OK)**:
```typescript
{
  comments: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      publicQuestId: "550e8400-e29b-41d4-a716-446655440001",
      familyId: "550e8400-e29b-41d4-a716-446655440005",
      content: "素晴らしいクエストですね！",
      upvotes: 5,
      downvotes: 0,
      isPinned: true,
      isReported: false,
      publisherLiked: true,
      family: {
        displayId: "family_002",
        onlineName: "佐藤家",
        iconId: 3
      },
      createdAt: "2026-03-02T10:00:00Z",
      updatedAt: "2026-03-02T10:00:00Z",
      deletedAt: null
    },
    ...
  ],
  total: 10
}
```

**Errors**:
- `404 Not Found`: クエストが存在しない

**Note**: ピン留めコメントが常に最上位に表示される

---

### POST /api/quests/public/:id/comments

**概要**: 公開クエストにコメントを投稿

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Request Body**:
```typescript
{
  content: string  // 最大1000文字
}
```

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "素晴らしいクエストですね！"
}
```

**Response (201 Created)**:
```typescript
{
  comment: {
    id: "550e8400-e29b-41d4-a716-446655440010",
    publicQuestId: "550e8400-e29b-41d4-a716-446655440001",
    familyId: "550e8400-e29b-41d4-a716-446655440005",
    content: "素晴らしいクエストですね！",
    upvotes: 0,
    downvotes: 0,
    isPinned: false,
    isReported: false,
    publisherLiked: false,
    createdAt: "2026-03-02T10:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
    deletedAt: null
  },
  commentsCount: 11
}
```

**Errors**:
- `400 Bad Request`: 不正な入力（空、長すぎる等）
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: クエストが存在しない

---

### PUT /api/quests/public/:id/comments/:commentId

**概要**: コメントを編集（投稿者本人のみ）

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Body**:
```typescript
{
  content: string  // 最大1000文字
}
```

**Request Example**:
```http
PUT /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "とても参考になるクエストですね！（編集済）"
}
```

**Response (200 OK)**:
```typescript
{
  comment: {
    id: "550e8400-e29b-41d4-a716-446655440010",
    publicQuestId: "550e8400-e29b-41d4-a716-446655440001",
    familyId: "550e8400-e29b-41d4-a716-446655440005",
    content: "とても参考になるクエストですね！（編集済）",
    upvotes: 5,
    downvotes: 0,
    isPinned: true,
    isReported: false,
    publisherLiked: true,
    createdAt: "2026-03-02T10:00:00Z",
    updatedAt: "2026-03-02T15:00:00Z",
    deletedAt: null
  }
}
```

**Errors**:
- `400 Bad Request`: 不正な入力
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 投稿者でない
- `404 Not Found`: コメントが存在しない

---

### DELETE /api/quests/public/:id/comments/:commentId

**概要**: コメントを削除（ソフトデリート）

**認証**: 必須

**権限**: 投稿者本人、クエスト公開者、管理者

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Example**:
```http
DELETE /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  commentsCount: 9
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 削除権限なし
- `404 Not Found`: コメントが存在しない

---

### POST /api/quests/public/:id/comments/:commentId/upvote

**概要**: コメントに高評価を付ける

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010/upvote
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  upvotes: 6
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: コメントが存在しない

---

### POST /api/quests/public/:id/comments/:commentId/downvote

**概要**: コメントに低評価を付ける

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010/downvote
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  downvotes: 1
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: コメントが存在しない

---

### POST /api/quests/public/:id/comments/:commentId/report

**概要**: コメントを報告（不適切な内容等）

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010/report
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  isReported: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: コメントが存在しない

**Note**: 報告されたコメントは管理者レビュー対象となる

---

### POST /api/quests/public/:id/comments/:commentId/pin

**概要**: コメントをピン留め（トグル）

**認証**: 必須

**権限**: クエスト公開者のみ

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010/pin
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  isPinned: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 公開者でない
- `404 Not Found`: コメントが存在しない

**Note**: ピン留めされたコメントは一覧の最上位に表示される

---

### POST /api/quests/public/:id/comments/:commentId/publisher-like

**概要**: 公開者いいね（トグル）

**認証**: 必須

**権限**: クエスト公開者のみ

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |
| commentId | uuid | Yes | コメントID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/comments/550e8400-e29b-41d4-a716-446655440010/publisher-like
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  publisherLiked: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 公開者でない
- `404 Not Found`: コメントが存在しない

**Note**: 公開者いいねマークはコメントに特別表示される

---

## 公開・非公開化

### POST /api/quests/public/:id/activate

**概要**: 非公開クエストを再公開

**認証**: 必須

**権限**: クエスト公開者のみ

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/activate
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  isActive: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 公開者でない
- `404 Not Found`: クエストが存在しない

---

### POST /api/quests/public/:id/deactivate

**概要**: 公開クエストを非公開化

**認証**: 必須

**権限**: クエスト公開者のみ

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 公開クエストID |

**Request Example**:
```http
POST /api/quests/public/550e8400-e29b-41d4-a716-446655440001/deactivate
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true,
  isActive: false
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 公開者でない
- `404 Not Found`: クエストが存在しない

**Note**: 非公開化しても既存のいいね・コメントは保持されるが、一覧には表示されない

---

## クライアント関数（client.ts）

```typescript
// 一覧取得
export const getPublicQuests = async (params: {
  limit?: number
  offset?: number
  categoryId?: number
  sortBy?: 'likes' | 'newest' | 'comments'
  search?: string
}): Promise<{ quests: PublicQuest[]; total: number }>

// 詳細取得
export const getPublicQuestById = async (
  id: string
): Promise<{ quest: PublicQuest; isLiked?: boolean }>

// いいね
export const likePublicQuest = async (id: string): Promise<void>

// いいね解除
export const unlikePublicQuest = async (id: string): Promise<void>

// コメント一覧取得
export const getPublicQuestComments = async (
  id: string,
  params: { limit?: number; offset?: number }
): Promise<{ comments: PublicQuestComment[]; total: number }>

// コメント投稿
export const postPublicQuestComment = async (
  id: string,
  content: string
): Promise<PublicQuestComment>

// コメント編集
export const updatePublicQuestComment = async (
  id: string,
  commentId: string,
  content: string
): Promise<PublicQuestComment>

// コメント削除
export const deletePublicQuestComment = async (
  id: string,
  commentId: string
): Promise<void>

// コメント高評価
export const upvoteComment = async (
  id: string,
  commentId: string
): Promise<void>

// コメント低評価
export const downvoteComment = async (
  id: string,
  commentId: string
): Promise<void>

// コメント報告
export const reportComment = async (
  id: string,
  commentId: string
): Promise<void>

// コメントピン留め
export const pinComment = async (
  id: string,
  commentId: string
): Promise<void>

// 公開者いいね
export const publisherLikeComment = async (
  id: string,
  commentId: string
): Promise<void>

// 非公開化
export const deactivatePublicQuest = async (id: string): Promise<void>

// 再公開
export const activatePublicQuest = async (id: string): Promise<void>
```

## React Queryフック（query.ts）

```typescript
// 一覧取得
export const usePublicQuests = (params: GetPublicQuestsParams)

// 詳細取得
export const usePublicQuest = (id: string)

// いいね
export const useLikePublicQuest = ()

// いいね解除
export const useUnlikePublicQuest = ()

// コメント一覧
export const usePublicQuestComments = (id: string, params: CommentsParams)

// コメント投稿
export const usePostComment = ()

// コメント編集
export const useUpdateComment = ()

// コメント削除
export const useDeleteComment = ()

// コメント高評価
export const useUpvoteComment = ()

// コメント低評価
export const useDownvoteComment = ()

// コメント報告
export const useReportComment = ()

// コメントピン留め
export const usePinComment = ()

// 公開者いいね
export const usePublisherLikeComment = ()

// 非公開化
export const useDeactivatePublicQuest = ()

// 再公開
export const useActivatePublicQuest = ()
```
