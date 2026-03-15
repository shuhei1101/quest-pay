(2026年3月記載)

# クエストビューAPI エンドポイント詳細

## ファイル構成

```
packages/web/app/api/quests/
├── family/
│   ├── client.ts                   # APIクライアント
│   ├── query.ts                    # React Queryフック
│   └── [id]/
│       ├── route.ts                # GET（詳細）、PUT（更新）、DELETE（削除）
│       └── child/
│           └── [childId]/
│               └── route.ts        # GET（子供クエスト取得/生成）
├── public/
│   ├── client.ts                   # APIクライアント
│   ├── query.ts                    # React Queryフック
│   └── [id]/
│       ├── route.ts                # GET（詳細）、PUT（更新）、DELETE（削除）
│       ├── like/
│       │   └── route.ts            # POST（いいね）、DELETE（いいね解除）
│       ├── like-count/
│       │   └── route.ts            # GET（いいね数）
│       └── is-like/
│           └── route.ts            # GET（いいね状態）
└── template/
    ├── client.ts                   # APIクライアント
    ├── query.ts                    # React Queryフック
    └── [id]/
        └── route.ts                # GET（詳細）、PUT（更新）、DELETE（削除）
```

## 家族クエスト閲覧API

### GET /api/quests/family/[id]

**概要**: 家族クエストの詳細を取得

**認証**: 必須（家族メンバー）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 家族クエストID |

**Request Example**:
```http
GET /api/quests/family/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  familyQuest: {
    base: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      parentId: "550e8400-e29b-41d4-a716-446655440002",
      questId: "550e8400-e29b-41d4-a716-446655440003",
      categoryId: 1,
      iconId: 42,
      iconColor: "#FF5733",
      iconSize: "MEDIUM",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    quest: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "お部屋の片付け",
      requestDetail: "自分の部屋を綺麗に片付ける",
      client: "parent"
    },
    details: [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        familyQuestId: "550e8400-e29b-41d4-a716-446655440001",
        level: 1,
        successCondition: "部屋全体を片付ける",
        reward: 50,
        childExp: 10,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        familyQuestId: "550e8400-e29b-41d4-a716-446655440001",
        level: 2,
        successCondition: "部屋全体を片付けて掃除機をかける",
        reward: 70,
        childExp: 15,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      }
    ],
    icon: {
      id: 42,
      name: "room_cleaning",
      size: "MEDIUM"
    },
    category: {
      id: 1,
      name: "家事",
      iconName: "home_work"
    },
    tags: [
      { id: 1, name: "掃除" },
      { id: 5, name: "整理整頓" }
    ]
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 家族メンバーではない
- `404 Not Found`: クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### PUT /api/quests/family/[id]

**概要**: 家族クエストを更新

**認証**: 必須（親ユーザーのみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 家族クエストID |

**Request Body**:
```typescript
{
  form: {
    title: string          // タイトル（必須、1-100文字）
    description: string    // 説明（必須、0-500文字）
    categoryId?: number    // カテゴリID（オプション）
    iconId?: number        // アイコンID（オプション）
    iconColor: string      // アイコンカラー（必須、HEX形式）
    iconSize: "SMALL" | "MEDIUM" | "LARGE"
    levels: [              // レベル詳細（必須、1-10個）
      {
        level: number      // レベル番号（1から順番）
        successCondition: string  // 成功条件
        reward: number     // 報酬額（必須、0-10000）
        childExp: number   // 経験値（必須、0-1000）
      }
    ]
    tagIds?: number[]      // タグID配列（オプション）
  }
  familyQuestUpdatedAt: string  // 楽観的排他制御用タイムスタンプ
  questUpdatedAt: string        // 楽観的排他制御用タイムスタンプ
}
```

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**Errors**:
- `400 Bad Request`: バリデーションエラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない
- `404 Not Found`: クエストが存在しない
- `409 Conflict`: 更新競合（他のユーザーが先に更新）
- `500 Internal Server Error`: サーバーエラー

---

### DELETE /api/quests/family/[id]

**概要**: 家族クエストを削除

**認証**: 必須（親ユーザーのみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 家族クエストID |

**Request Body**:
```typescript
{
  updatedAt: string  // 楽観的排他制御用タイムスタンプ
}
```

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**Errors**:
- `400 Bad Request`: 進行中の子供クエストが存在する（削除不可）
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない
- `404 Not Found`: クエストが存在しない
- `409 Conflict`: 削除競合
- `500 Internal Server Error`: サーバーエラー

---

## 公開クエスト閲覧API

### GET /api/quests/public/[id]

**概要**: 公開クエストの詳細を取得

**認証**: オプション（未ログインでも閲覧可能、ログイン時はいいね状態を含む）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 公開クエストID |

**Request Example**:
```http
GET /api/quests/public/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>  # オプション
```

**Response (200 OK)**:
```typescript
{
  publicQuest: {
    base: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      familyQuestId: "550e8400-e29b-41d4-a716-446655440002",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      isActive: true,
      totalLikes: 15,
      totalComments: 3,
      totalAdoptions: 5,
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    quest: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "お部屋の片付け",
      requestDetail: "自分の部屋を綺麗に片付ける",
      client: "parent"
    },
    details: [ /* family_quest_detailsと同じ構造 */ ],
    icon: { /* iconと同じ構造 */ },
    category: { /* categoryと同じ構造 */ },
    tags: [ /* tagsと同じ構造 */ ],
    family: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      displayId: "tanaka-family",
      localName: "田中家",
      onlineName: "たなか"
    },
    familyIcon: {
      id: 10,
      name: "family_icon_01",
      size: "MEDIUM"
    },
    likes: {
      totalLikes: 15,
      isLiked: true  // ログイン時のみ、未ログイン時はfalse
    },
    comments: [
      {
        id: "550e8400-e29b-41d4-a716-446655440020",
        publicQuestId: "550e8400-e29b-41d4-a716-446655440001",
        profileId: "550e8400-e29b-41d4-a716-446655440021",
        profile: {
          displayName: "佐藤さん",
          avatarUrl: "https://..."
        },
        comment: "いいクエストですね！",
        createdAt: "2026-03-02T10:00:00Z",
        updatedAt: "2026-03-02T10:00:00Z"
      }
    ]
  }
}
```

**Errors**:
- `404 Not Found`: 公開クエストが存在しない
- `410 Gone`: 公開クエストが非アクティブ（公開終了）
- `500 Internal Server Error`: サーバーエラー

---

### GET /api/quests/public/[id]/like-count

**概要**: 公開クエストのいいね数を取得

**認証**: 不要

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 公開クエストID |

**Response (200 OK)**:
```typescript
{
  likeCount: 15
}
```

---

### GET /api/quests/public/[id]/is-like

**概要**: ログインユーザーが公開クエストにいいねしているか確認

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 公開クエストID |

**Response (200 OK)**:
```typescript
{
  isLike: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗

---

### POST /api/quests/public/[id]/like

**概要**: 公開クエストにいいねを追加

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 公開クエストID |

**Request Body**: なし

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 公開クエストが存在しない
- `409 Conflict`: 既にいいね済み
- `500 Internal Server Error`: サーバーエラー

---

### DELETE /api/quests/public/[id]/like

**概要**: 公開クエストのいいねを解除

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 公開クエストID |

**Request Body**: なし

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: いいねが存在しない
- `500 Internal Server Error`: サーバーエラー

---

## テンプレートクエスト閲覧API

### GET /api/quests/template/[id]

**概要**: テンプレートクエストの詳細を取得

**認証**: 必須

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | テンプレートクエストID |

**Request Example**:
```http
GET /api/quests/template/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  templateQuest: {
    base: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      questId: "550e8400-e29b-41d4-a716-446655440003",
      categoryId: 1,
      iconId: 42,
      iconColor: "#FF5733",
      iconSize: "MEDIUM",
      isOfficial: true,
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    quest: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "お部屋の片付け",
      requestDetail: "自分の部屋を綺麗に片付ける",
      client: "parent"
    },
    details: [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        templateQuestId: "550e8400-e29b-41d4-a716-446655440001",
        level: 1,
        successCondition: "部屋全体を片付ける",
        reward: 50,
        childExp: 10,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      }
    ],
    icon: { /* iconと同じ構造 */ },
    category: { /* categoryと同じ構造 */ },
    tags: [ /* tagsと同じ構造 */ ]
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: テンプレートクエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### PUT /api/quests/template/[id]

**概要**: テンプレートクエストを更新（管理者のみ）

**認証**: 必須（管理者のみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | テンプレートクエストID |

**Request Body**:
```typescript
{
  form: {
    /* family_questと同じform構造 */
  }
  updatedAt: string  // 楽観的排他制御用タイムスタンプ
}
```

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 管理者ではない
- `404 Not Found`: テンプレートが存在しない
- `409 Conflict`: 更新競合
- `500 Internal Server Error`: サーバーエラー

---

### DELETE /api/quests/template/[id]

**概要**: テンプレートクエストを削除（管理者のみ）

**認証**: 必須（管理者のみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | テンプレートクエストID |

**Request Body**:
```typescript
{
  updatedAt: string  // 楽観的排他制御用タイムスタンプ
}
```

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 管理者ではない
- `404 Not Found`: テンプレートが存在しない
- `409 Conflict`: 削除競合
- `500 Internal Server Error`: サーバーエラー

---

## 子供クエスト閲覧API

### GET /api/quests/family/[id]/child/[childId]

**概要**: 子供クエストの詳細を取得（存在しない場合は自動生成）

**認証**: 必須（子供本人または親）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 家族クエストID |
| childId | uuid | 子供ID |

**Request Example**:
```http
GET /api/quests/family/550e8400-e29b-41d4-a716-446655440001/child/550e8400-e29b-41d4-a716-446655440010
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  childQuest: {
    base: {
      id: "550e8400-e29b-41d4-a716-446655440100",
      childId: "550e8400-e29b-41d4-a716-446655440010",
      familyQuestDetailId: "550e8400-e29b-41d4-a716-446655440011",
      status: "in_progress",
      completionNote: null,
      startedAt: "2026-03-05T10:00:00Z",
      completedAt: null,
      reportedAt: null,
      reviewedAt: null,
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-05T10:00:00Z"
    },
    familyQuest: {
      /* family_questと同じ構造 */
    },
    quest: {
      /* questと同じ構造 */
    },
    detail: {
      id: "550e8400-e29b-41d4-a716-446655440011",
      familyQuestId: "550e8400-e29b-41d4-a716-446655440001",
      level: 1,
      successCondition: "部屋全体を片付ける",
      reward: 50,
      childExp: 10,
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    icon: { /* iconと同じ構造 */ },
    category: { /* categoryと同じ構造 */ }
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 子供本人または親ではない
- `404 Not Found`: 家族クエストまたは子供が存在しない
- `500 Internal Server Error`: サーバーエラー

---

## クライアント関数とReact Queryフック

### 家族クエスト閲覧

**クライアント関数**:
```typescript
// packages/web/app/api/quests/family/[id]/client.ts
export const getFamilyQuest = async ({ familyQuestId }: { familyQuestId: string }) => {
  // GET /api/quests/family/[id]
}

export const putFamilyQuest = async ({ request, familyQuestId }: {
  request: PutFamilyQuestRequest
  familyQuestId: string
}) => {
  // PUT /api/quests/family/[id]
}

export const deleteFamilyQuest = async ({ request, familyQuestId }: {
  request: DeleteFamilyQuestRequest
  familyQuestId: string
}) => {
  // DELETE /api/quests/family/[id]
}
```

**React Queryフック**:
```typescript
// packages/web/app/(app)/quests/family/[id]/view/_hooks/useFamilyQuest.ts
export const useFamilyQuest = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["familyQuest", id],
    queryFn: () => getFamilyQuest({ familyQuestId: id }),
    enabled: !!id
  })
  
  return {
    familyQuest: data?.familyQuest,
    isLoading,
  }
}
```

### 公開クエスト閲覧

**クライアント関数**:
```typescript
// packages/web/app/api/quests/public/[id]/client.ts
export const getPublicQuest = async ({ publicQuestId }: { publicQuestId: string }) => {
  // GET /api/quests/public/[id]
}

export const likePublicQuest = async ({ publicQuestId }: { publicQuestId: string }) => {
  // POST /api/quests/public/[id]/like
}

export const cancelLikePublicQuest = async ({ publicQuestId }: { publicQuestId: string }) => {
  // DELETE /api/quests/public/[id]/like
}

export const getLikeCount = async ({ publicQuestId }: { publicQuestId: string }) => {
  // GET /api/quests/public/[id]/like-count
}

export const getIsLike = async ({ publicQuestId }: { publicQuestId: string }) => {
  // GET /api/quests/public/[id]/is-like
}
```

**React Queryフック**:
```typescript
// packages/web/app/(app)/quests/public/[id]/view/_hooks/usePublicQuest.ts
export const usePublicQuest = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["publicQuest", id],
    queryFn: () => getPublicQuest({ publicQuestId: id }),
    enabled: !!id
  })
  
  return {
    publicQuest: data?.publicQuest,
    isLoading,
  }
}

// packages/web/app/(app)/quests/public/[id]/view/_hooks/useLikeQuest.ts
export const useLikeQuest = () => {
  const queryClient = useQueryClient()
  
  const { mutate, isPending } = useMutation({
    mutationFn: likePublicQuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicQuest"] })
    }
  })
  
  return {
    handleLike: mutate,
    isLoading: isPending,
  }
}
```

### テンプレートクエスト閲覧

**クライアント関数**:
```typescript
// packages/web/app/api/quests/template/[id]/client.ts
export const getTemplateQuest = async ({ templateQuestId }: { templateQuestId: string }) => {
  // GET /api/quests/template/[id]
}
```

**React Queryフック**:
```typescript
// packages/web/app/(app)/quests/template/[id]/view/_hooks/useTemplateQuest.ts
export const useTemplateQuest = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["templateQuest", id],
    queryFn: () => getTemplateQuest({ templateQuestId: id }),
    enabled: !!id
  })
  
  return {
    templateQuest: data?.templateQuest,
    isLoading,
  }
}
```
