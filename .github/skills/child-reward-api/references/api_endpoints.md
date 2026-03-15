(2026年3月記載)

# 子供報酬API エンドポイント詳細

## ファイル構成

```
packages/web/app/api/
├── children/
│   └── [id]/
│       └── reward/
│           ├── by-age/
│           │   └── table/
│           │       ├── route.ts      # GET/PUT 年齢別報酬テーブル
│           │       ├── client.ts     # APIクライアント
│           │       ├── service.ts    # ビジネスロジック
│           │       ├── query.ts      # React Queryフック
│           │       └── db.ts         # DB操作
│           └── by-level/
│               └── table/
│                   ├── route.ts      # GET/PUT レベル別報酬テーブル
│                   ├── client.ts     # APIクライアント
│                   ├── service.ts    # ビジネスロジック
│                   ├── query.ts      # React Queryフック
│                   └── db.ts         # DB操作
└── reward/
    ├── by-age/
    │   ├── query.ts    # 共通クエリ（type="child" | "family"対応）
    │   ├── db.ts       # 共通DB操作（type="child" | "family"対応）
    │   └── service.ts  # 共通サービス（type="child" | "family"対応）
    └── by-level/
        ├── query.ts    # 共通クエリ（type="child" | "family"対応）
        ├── db.ts       # 共通DB操作（type="child" | "family"対応）
        └── service.ts  # 共通サービス（type="child" | "family"対応）
```

## 年齢別報酬テーブル操作

### GET /api/children/[id]/reward/by-age/table

**概要**: 子供の年齢別報酬テーブルを取得（存在しない場合は自動作成）

**認証**: 必須（親のみ）

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 子供ID |

**Request Example**:
```http
GET /api/children/550e8400-e29b-41d4-a716-446655440001/reward/by-age/table
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  ageRewardTable: {
    table: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      childId: "550e8400-e29b-41d4-a716-446655440001",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    rewards: [
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        type: "child",
        ageRewardTableId: "550e8400-e29b-41d4-a716-446655440002",
        age: 5,
        amount: 50,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        type: "child",
        ageRewardTableId: "550e8400-e29b-41d4-a716-446655440002",
        age: 6,
        amount: 60,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      },
      // ... 年齢 5-22 の全データ
    ]
  }
}
```

**Errors**:
- `400 Bad Request`: 親以外がアクセスした場合
  ```json
  {
    "message": "親のみアクセス可能です。"
  }
  ```
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 子供が存在しない

**実装の詳細**:
- テーブルが存在しない場合、自動的に作成される
- 作成時、年齢5-22歳のデフォルト報酬額が自動挿入される
- デフォルト報酬額: `DEFAULT_AGE_REWARD_AMOUNTS`（50-220円）

---

### PUT /api/children/[id]/reward/by-age/table

**概要**: 子供の年齢別報酬テーブルを更新

**認証**: 必須（親のみ）

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 子供ID |

**Request Body**:
```typescript
{
  rewards: Array<{
    age: number     // 年齢（5-22）
    amount: number  // 金額（0以上）
  }>
}
```

**Request Example**:
```http
PUT /api/children/550e8400-e29b-41d4-a716-446655440001/reward/by-age/table
Authorization: Bearer <token>
Content-Type: application/json

{
  "rewards": [
    { "age": 5, "amount": 100 },
    { "age": 6, "amount": 120 },
    { "age": 7, "amount": 140 },
    // ... 全年齢のデータ
  ]
}
```

**Response (200 OK)**:
```typescript
{}
```

**Errors**:
- `400 Bad Request`: バリデーションエラー
  ```json
  {
    "message": "入力値が不正です。",
    "errors": [
      {
        "path": ["rewards", 0, "age"],
        "message": "年齢は5-22の範囲で指定してください。"
      }
    ]
  }
  ```
- `400 Bad Request`: 親以外がアクセスした場合
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 子供が存在しない

**バリデーション**:
```typescript
const PutChildAgeRewardTableRequestSchema = z.object({
  rewards: z.array(
    z.object({
      age: z.number().int().min(5).max(22),
      amount: z.number().int().min(0)
    })
  ).min(1)
})
```

**実装の詳細**:
- テーブルが存在しない場合、自動的に作成される
- トランザクション内で全ての報酬額を一括更新
- 共通関数 `updateAgeRewards` を使用（`type="child"` を指定）

---

## レベル別報酬テーブル操作

### GET /api/children/[id]/reward/by-level/table

**概要**: 子供のレベル別報酬テーブルを取得（存在しない場合は自動作成）

**認証**: 必須（親のみ）

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 子供ID |

**Request Example**:
```http
GET /api/children/550e8400-e29b-41d4-a716-446655440001/reward/by-level/table
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  levelRewardTable: {
    table: {
      id: "550e8400-e29b-41d4-a716-446655440005",
      childId: "550e8400-e29b-41d4-a716-446655440001",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z"
    },
    rewards: [
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        type: "child",
        levelRewardTableId: "550e8400-e29b-41d4-a716-446655440005",
        level: 1,
        amount: 50,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440007",
        type: "child",
        levelRewardTableId: "550e8400-e29b-41d4-a716-446655440005",
        level: 2,
        amount: 70,
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z"
      },
      // ... レベル 1-12 の全データ
    ]
  }
}
```

**Errors**:
- `400 Bad Request`: 親以外がアクセスした場合
  ```json
  {
    "message": "親のみアクセス可能です。"
  }
  ```
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 子供が存在しない

**実装の詳細**:
- テーブルが存在しない場合、自動的に作成される
- 作成時、レベル1-12のデフォルト報酬額が自動挿入される
- デフォルト報酬額: `DEFAULT_LEVEL_REWARD_AMOUNTS`（50-300円）

---

### PUT /api/children/[id]/reward/by-level/table

**概要**: 子供のレベル別報酬テーブルを更新

**認証**: 必須（親のみ）

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | 子供ID |

**Request Body**:
```typescript
{
  rewards: Array<{
    level: number   // レベル（1-12）
    amount: number  // 金額（0以上）
  }>
}
```

**Request Example**:
```http
PUT /api/children/550e8400-e29b-41d4-a716-446655440001/reward/by-level/table
Authorization: Bearer <token>
Content-Type: application/json

{
  "rewards": [
    { "level": 1, "amount": 50 },
    { "level": 2, "amount": 70 },
    { "level": 3, "amount": 100 },
    // ... 全レベルのデータ
  ]
}
```

**Response (200 OK)**:
```typescript
{}
```

**Errors**:
- `400 Bad Request`: バリデーションエラー
  ```json
  {
    "message": "入力値が不正です。",
    "errors": [
      {
        "path": ["rewards", 0, "level"],
        "message": "レベルは1-12の範囲で指定してください。"
      }
    ]
  }
  ```
- `400 Bad Request`: 親以外がアクセスした場合
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 子供が存在しない

**バリデーション**:
```typescript
const PutChildLevelRewardTableRequestSchema = z.object({
  rewards: z.array(
    z.object({
      level: z.number().int().min(1).max(12),
      amount: z.number().int().min(0)
    })
  ).min(1)
})
```

**実装の詳細**:
- テーブルが存在しない場合、自動的に作成される
- トランザクション内で全ての報酬額を一括更新
- 共通関数 `updateLevelRewards` を使用（`type="child"` を指定）

---

## 共通化されたAPI実装

### 共通クエリ関数

#### fetchAgeRewards
```typescript
// /api/reward/by-age/query.ts
export const fetchAgeRewards = async ({
  db,
  ageRewardTableId,
  type = "family"  // "family" | "child"
}): Promise<RewardByAgeSelect[]> => {
  return await db
    .select()
    .from(rewardByAges)
    .where(
      and(
        eq(rewardByAges.type, type),
        eq(rewardByAges.ageRewardTableId, ageRewardTableId)
      )
    )
    .orderBy(rewardByAges.age)
}
```

#### fetchLevelRewards
```typescript
// /api/reward/by-level/query.ts
export const fetchLevelRewards = async ({
  db,
  levelRewardTableId,
  type = "family"  // "family" | "child"
}): Promise<RewardByLevelSelect[]> => {
  return await db
    .select()
    .from(rewardByLevels)
    .where(
      and(
        eq(rewardByLevels.type, type),
        eq(rewardByLevels.levelRewardTableId, levelRewardTableId)
      )
    )
    .orderBy(rewardByLevels.level)
}
```

### 共通DB操作関数

#### updateAgeReward
```typescript
// /api/reward/by-age/db.ts
export const updateAgeReward = async ({
  db,
  ageRewardTableId,
  age,
  amount,
  type = "family"  // "family" | "child"
}): Promise<void> => {
  await db
    .update(rewardByAges)
    .set({ amount, updatedAt: new Date() })
    .where(
      and(
        eq(rewardByAges.type, type),
        eq(rewardByAges.ageRewardTableId, ageRewardTableId),
        eq(rewardByAges.age, age)
      )
    )
}
```

#### updateLevelReward
```typescript
// /api/reward/by-level/db.ts
export const updateLevelReward = async ({
  db,
  levelRewardTableId,
  level,
  amount,
  type = "family"  // "family" | "child"
}): Promise<void> => {
  await db
    .update(rewardByLevels)
    .set({ amount, updatedAt: new Date() })
    .where(
      and(
        eq(rewardByLevels.type, type),
        eq(rewardByLevels.levelRewardTableId, levelRewardTableId),
        eq(rewardByLevels.level, level)
      )
    )
}
```

### 共通サービス関数

#### updateFamilyAgeRewards (子供にも使用可能)
```typescript
// /api/reward/by-age/service.ts
export const updateFamilyAgeRewards = async ({
  db,
  ageRewardTableId,
  rewards,
  type = "family"  // "family" | "child"
}): Promise<void> => {
  await db.transaction(async (tx) => {
    for (const { age, amount } of rewards) {
      await updateAgeReward({
        db: tx,
        ageRewardTableId,
        age,
        amount,
        type
      })
    }
  })
}
```

---

## React Query フック

### 年齢別報酬テーブル

```typescript
// /api/children/[id]/reward/by-age/table/query.ts
export const useChildAgeRewardTable = (childId: string) => {
  return useQuery({
    queryKey: ["child-age-reward-table", childId],
    queryFn: () => getChildAgeRewardTable(childId),
    enabled: !!childId
  })
}

export const useUpdateChildAgeRewardTable = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      childId,
      request
    }: {
      childId: string
      request: PutChildAgeRewardTableRequest
    }) => putChildAgeRewardTable(childId, request),
    onSuccess: (_, { childId }) => {
      queryClient.invalidateQueries({
        queryKey: ["child-age-reward-table", childId]
      })
    }
  })
}
```

### レベル別報酬テーブル

```typescript
// /api/children/[id]/reward/by-level/table/query.ts
export const useChildLevelRewardTable = (childId: string) => {
  return useQuery({
    queryKey: ["child-level-reward-table", childId],
    queryFn: () => getChildLevelRewardTable(childId),
    enabled: !!childId
  })
}

export const useUpdateChildLevelRewardTable = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      childId,
      request
    }: {
      childId: string
      request: PutChildLevelRewardTableRequest
    }) => putChildLevelRewardTable(childId, request),
    onSuccess: (_, { childId }) => {
      queryClient.invalidateQueries({
        queryKey: ["child-level-reward-table", childId]
      })
    }
  })
}
```

---

## エラーハンドリング

全てのエンドポイントで `withRouteErrorHandling` を使用:

```typescript
export async function GET(req: NextRequest, context: Context) {
  return withRouteErrorHandling(async () => {
    // 実装
  })
}
```

共通エラーレスポンス形式:
```typescript
{
  message: string
  errors?: Array<{
    path: string[]
    message: string
  }>
}
```
