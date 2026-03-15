(2026年3月15日 14:30記載)

# 子供管理API エンドポイント詳細

## ファイル構成

```
packages/web/app/api/children/
├── route.ts                        # GET（一覧）、POST（作成）
├── client.ts                       # APIクライアント
├── query.ts                        # DBクエリ関数
├── service.ts                      # ビジネスロジック
├── db.ts                          # DB操作ヘルパー
├── [id]/
│   ├── route.ts                   # GET（詳細）、PUT（更新）、DELETE（削除）
│   ├── client.ts                  # APIクライアント
│   ├── quests/
│   │   └── route.ts              # GET（子供のクエスト一覧）
│   └── reward/
│       └── route.ts              # GET（報酬履歴）、POST（報酬付与）
├── invite/
│   └── service.ts                # 招待コード生成サービス
└── join/
    └── route.ts                  # POST（招待コードで参加）
```

## 基本CRUD操作

### GET /api/children

**概要**: 家族の子供一覧を取得

**認証**: 必須（家族メンバー）

**Query Parameters**: なし（familyIdは認証コンテキストから取得）

**Request Example**:
```http
GET /api/children
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  children: [
    {
      children: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        profileId: "550e8400-e29b-41d4-a716-446655440002",
        inviteCode: "ABC123",
        minSavings: 0,
        currentSavings: 500,
        currentLevel: 3,
        totalExp: 250,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-15T12:00:00Z"
      },
      profiles: {
        id: "550e8400-e29b-41d4-a716-446655440002",
        userId: "550e8400-e29b-41d4-a716-446655440003",
        name: "太郎",
        birthday: "2015-04-10",
        familyId: "550e8400-e29b-41d4-a716-446655440000",
        iconId: 42,
        iconColor: "#FF5733",
        type: "child",
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-15T12:00:00Z"
      }
    },
    ...
  ],
  questStats: {
    "550e8400-e29b-41d4-a716-446655440001": {
      notStarted: 5,
      inProgress: 2,
      pendingReview: 1,
      completed: 10
    },
    ...
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 家族メンバーではない
- `500 Internal Server Error`: 家族ID取得失敗、サーバーエラー

---

### POST /api/children

**概要**: 新しい子供を登録

**認証**: 必須（親ユーザーのみ）

**Request Body**:
```typescript
{
  form: {
    name: string          // 名前（必須、1-50文字）
    iconId: number        // アイコンID（必須）
    iconColor: string     // アイコンカラー（必須、HEX形式）
    birthday?: string     // 生年月日（オプション、YYYY-MM-DD形式）
  }
}
```

**Validation**:
- `form.name`: 1-50文字、必須
- `form.iconId`: 正の整数、必須
- `form.iconColor`: HEX形式（例: "#FF5733"）、必須
- `form.birthday`: YYYY-MM-DD形式、オプション

**Request Example**:
```http
POST /api/children
Authorization: Bearer <token>
Content-Type: application/json

{
  "form": {
    "name": "次郎",
    "iconId": 15,
    "iconColor": "#3498DB",
    "birthday": "2017-08-20"
  }
}
```

**Response (200 OK)**:
```typescript
{
  childId: "550e8400-e29b-41d4-a716-446655440010"
}
```

**処理フロー**:
1. 認証コンテキストからuserIdとdbを取得
2. userIdからfamilyIdを取得
3. 一意の招待コードを生成（最大10回試行）
4. トランザクション開始
5. profilesテーブルにレコード作成（type='child', user_id=null）
6. childrenテーブルにレコード作成（inviteCode設定）
7. トランザクションコミット

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: 家族ID取得失敗、招待コード生成失敗、DB挿入失敗

---

### GET /api/children/[id]

**概要**: 子供の詳細情報を取得

**認証**: 必須（同じ家族メンバー）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 子供ID |

**Query Parameters**: なし

**Request Example**:
```http
GET /api/children/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  child: {
    children: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      profileId: "550e8400-e29b-41d4-a716-446655440002",
      inviteCode: "ABC123",
      minSavings: 0,
      currentSavings: 500,
      currentLevel: 3,
      totalExp: 250,
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-15T12:00:00Z"
    },
    profiles: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      userId: "550e8400-e29b-41d4-a716-446655440003",
      name: "太郎",
      birthday: "2015-04-10",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      iconId: 42,
      iconColor: "#FF5733",
      type: "child",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-15T12:00:00Z"
    }
  },
  questStats: {
    notStarted: 5,
    inProgress: 2,
    pendingReview: 1,
    completed: 10
  },
  rewardStats: {
    totalRewards: 1500,
    questRewards: 1000,
    ageMonthlyRewards: 300,
    levelMonthlyRewards: 200,
    otherRewards: 0
  },
  fixedReward: {
    ageReward: 100,      // 年齢別定期報酬
    levelReward: 50      // レベル別定期報酬
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 同じ家族メンバーではない
- `404 Not Found`: 子供が存在しない
- `500 Internal Server Error`: サーバーエラー

---

### PUT /api/children/[id]

**概要**: 子供のプロフィール情報を更新

**認証**: 必須（親ユーザー、または本人）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 子供ID |

**Request Body**:
```typescript
{
  form: {
    name?: string         // 名前（1-50文字）
    iconId?: number       // アイコンID
    iconColor?: string    // アイコンカラー（HEX形式）
    birthday?: string     // 生年月日（YYYY-MM-DD形式）
  }
}
```

**Request Example**:
```http
PUT /api/children/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
Content-Type: application/json

{
  "form": {
    "name": "太郎（更新）",
    "iconColor": "#E74C3C"
  }
}
```

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**処理フロー**:
1. 認証コンテキストからuserIdとdbを取得
2. 子供情報を取得して家族ID検証
3. トランザクション開始
4. profilesテーブルを更新（name, iconId, iconColor, birthday）
5. トランザクションコミット

**Note**: 
- childrenテーブルのシステム管理カラム（minSavings, currentSavings, currentLevel, totalExp, inviteCode）は更新不可
- これらはクエスト完了報酬システムによって自動更新される

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 権限不足
- `404 Not Found`: 子供が存在しない
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: サーバーエラー

---

### DELETE /api/children/[id]

**概要**: 子供を削除

**認証**: 必須（親ユーザーのみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 子供ID |

**Request Example**:
```http
DELETE /api/children/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  success: true
}
```

**処理フロー**:
1. 認証コンテキストからuserIdとdbを取得
2. 子供情報を取得して家族ID検証
3. トランザクション開始
4. childrenテーブルからレコード削除（カスケード削除: child_quests, reward_history）
5. profilesテーブルからレコード削除（カスケード削除: auth.users if exists）
6. トランザクションコミット

**Cascade削除される関連レコード**:
- `child_quests`: 子供のクエストデータ
- `reward_history`: 報酬履歴
- `auth.users`: 認証情報（存在する場合）

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない、または別家族の子供
- `404 Not Found`: 子供が存在しない
- `500 Internal Server Error`: サーバーエラー

---

## 関連エンドポイント

### GET /api/children/[id]/quests

**概要**: 子供が受注したクエスト一覧を取得

**詳細**: `child-quest-api` スキル参照

---

### GET /api/children/[id]/reward

**概要**: 子供の報酬履歴を取得

**詳細**: `child-reward-api` スキル参照

---

### POST /api/children/[id]/reward

**概要**: 子供に報酬を付与（手動）

**詳細**: `child-reward-api` スキル参照

---

### POST /api/children/join

**概要**: 招待コードを使って子供アカウントにログイン情報を紐付け

**認証**: 必須（新規ユーザー）

**Request Body**:
```typescript
{
  inviteCode: string    // 招待コード（6桁）
}
```

**Response (200 OK)**:
```typescript
{
  childId: string,
  profileId: string
}
```

**処理フロー**:
1. 招待コードでchildrenレコードを検索
2. 対応するprofilesレコードのuser_idがnullか確認
3. 認証ユーザーのuserIdをprofiles.user_idに設定
4. 子供アカウントとauth.usersが紐付けられる

---

## クライアント関数

### client.ts

```typescript
// 子供一覧取得
export const getChildren = async (): Promise<GetChildrenResponse>

// 子供登録
export const postChild = async (request: PostChildRequest): Promise<PostChildResponse>
```

### [id]/client.ts

```typescript
// 子供詳細取得
export const getChild = async (childId: string): Promise<GetChildResponse>

// 子供情報更新
export const putChild = async (childId: string, request: PutChildRequest): Promise<{success: boolean}>

// 子供削除
export const deleteChild = async (childId: string): Promise<{success: boolean}>
```

---

## React Queryフック

### query.ts

```typescript
// 子供一覧取得
export const useChildren = () => useQuery({
  queryKey: ['children'],
  queryFn: getChildren,
})

// 子供登録
export const usePostChild = () => useMutation({
  mutationFn: postChild,
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['children']})
  }
})
```

### [id]/query.ts (想定)

```typescript
// 子供詳細取得
export const useChild = (childId: string) => useQuery({
  queryKey: ['children', childId],
  queryFn: () => getChild(childId),
})

// 子供情報更新
export const usePutChild = () => useMutation({
  mutationFn: ({childId, request}) => putChild(childId, request),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['children']})
  }
})

// 子供削除
export const useDeleteChild = () => useMutation({
  mutationFn: deleteChild,
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['children']})
  }
})
```

---

## データベースクエリ関数

### query.ts

```typescript
// 家族IDで子供一覧を取得
export const fetchChildrenByFamilyId = async ({db, familyId}: {
  db: Db
  familyId: string
})

// 子供IDで子供を取得
export const fetchChild = async ({db, childId}: {
  db: Db
  childId: string
})

// 招待コードで子供を取得
export const fetchChildByInviteCode = async ({db, invite_code}: {
  db: Db
  invite_code: string
})

// 子供のクエスト統計を取得
export const fetchChildQuestStats = async ({db, childId}: {
  db: Db
  childId: string
})

// 子供の報酬統計を取得
export const fetchChildRewardStats = async ({db, childId}: {
  db: Db
  childId: string
})

// 子供の定額報酬を取得
export const fetchChildFixedReward = async ({db, childId, age, level}: {
  db: Db
  childId: string
  age: number
  level: number
})
```

---

## サービス関数

### service.ts

```typescript
// 子供登録
export const registerChild = async ({child, profile}: {
  child: ChildInsert
  profile: ProfileInsert
}): Promise<string>

// 子供情報更新
export const updateChild = async ({db, childId, profile}: {
  db: Db
  childId: string
  profile: Partial<ProfileUpdate>
}): Promise<void>

// 子供削除
export const deleteChild = async ({db, childId}: {
  db: Db
  childId: string
}): Promise<void>
```

### invite/service.ts

```typescript
// 一意の招待コードを生成
export const generateUniqueInviteCode = async ({db}: {
  db: Db
}): Promise<string>
```

---

## エラーハンドリング

### 共通エラーレスポンス

```typescript
{
  error: string,
  code?: string,
  details?: unknown
}
```

### エラーコード一覧

| ステータスコード | 説明 | 発生条件 |
|------------------|------|---------|
| 401 Unauthorized | 認証失敗 | トークン不正、期限切れ |
| 403 Forbidden | 権限不足 | 別家族の子供にアクセス、親以外が作成/削除 |
| 404 Not Found | リソース未発見 | 子供ID不正 |
| 422 Unprocessable Entity | バリデーションエラー | 入力値不正 |
| 500 Internal Server Error | サーバー内部エラー | DB接続失敗、トランザクション失敗、招待コード生成失敗 |

---

## トランザクション管理

### 必須トランザクション操作

1. **POST /api/children**: profiles + children 挿入
2. **PUT /api/children/[id]**: profiles 更新
3. **DELETE /api/children/[id]**: children + profiles 削除

### 排他制御

子供管理APIでは、ほとんどの操作で排他制御は不要です。以下の場合のみ検討：

- **報酬付与**: `reward_history`への挿入と`children.currentSavings`の加算を同時実行する場合
- **レベルアップ**: `children.totalExp`と`currentLevel`を同時更新する場合

排他制御が必要な場合は`db_helper.ts`の`FOR UPDATE`を使用：

```typescript
await db.select()
  .from(children)
  .where(eq(children.id, childId))
  .for('update')
```
