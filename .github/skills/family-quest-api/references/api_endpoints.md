(2026年3月15日 14:30記載)

# 家族クエストAPI エンドポイント詳細

## ファイル構成

```
packages/web/app/api/quests/family/
├── route.ts                        # GET（一覧）、POST（作成）
├── client.ts                       # APIクライアント
├── query.ts                        # React Queryフック
└── [id]/
    ├── route.ts                    # GET（詳細）、PUT（更新）、DELETE（削除）
    ├── publish/
    │   └── route.ts                # POST（公開）
    ├── public/
    │   └── route.ts                # GET（公開クエスト取得）
    ├── review-request/
    │   └── route.ts                # POST（完了報告）
    ├── cancel-review/
    │   └── route.ts                # POST（報告キャンセル）
    └── child/
        └── [childId]/
            ├── route.ts            # GET（子供クエスト取得/生成）
            ├── approve/
            │   └── route.ts        # POST（承認）
            └── reject/
                └── route.ts        # POST（却下）
```

## 基本CRUD操作

### GET /api/quests/family

**概要**: 家族クエスト一覧を取得

**認証**: 必須（家族メンバー）

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| familyId | uuid | Yes | 家族ID |
| limit | number | No | 取得件数（デフォルト: 20） |
| offset | number | No | オフセット（デフォルト: 0） |

**Request Example**:
```http
GET /api/quests/family?familyId=550e8400-e29b-41d4-a716-446655440000&limit=10&offset=0
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  quests: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      parentId: "550e8400-e29b-41d4-a716-446655440002",
      title: "お部屋の片付け",
      description: "自分の部屋を綺麗に片付ける",
      categoryId: 1,
      iconId: 42,
      iconColor: "#FF5733",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z",
      details: [
        { id: "...", level: 1, reward: 50 },
        { id: "...", level: 2, reward: 70 },
        { id: "...", level: 3, reward: 100 }
      ]
    },
    ...
  ],
  total: 25
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 家族メンバーではない
- `500 Internal Server Error`: サーバーエラー

---

### POST /api/quests/family

**概要**: 新しい家族クエストを作成

**認証**: 必須（親ユーザーのみ）

**Request Body**:
```typescript
{
  familyId: string      // 家族ID（必須）
  title: string         // タイトル（必須、1-100文字）
  description: string   // 説明（必須、0-500文字）
  categoryId?: number   // カテゴリID（オプション）
  iconId?: number       // アイコンID（オプション）
  iconColor: string     // アイコンカラー（必須、HEX形式）
  levels: [             // レベル詳細（必須、1-10個）
    {
      level: number     // レベル番号（1から順番）
      reward: number    // 報酬額（必須、0-10000）
    }
  ]
}
```

**Request Example**:
```http
POST /api/quests/family
Authorization: Bearer <token>
Content-Type: application/json

{
  "familyId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "お部屋の片付け",
  "description": "自分の部屋を綺麗に片付ける",
  "categoryId": 1,
  "iconId": 42,
  "iconColor": "#FF5733",
  "levels": [
    { "level": 1, "reward": 50 },
    { "level": 2, "reward": 70 },
    { "level": 3, "reward": 100 }
  ]
}
```

**Response (201 Created)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440001",
  familyId: "550e8400-e29b-41d4-a716-446655440000",
  parentId: "550e8400-e29b-41d4-a716-446655440002",
  title: "お部屋の片付け",
  description: "自分の部屋を綺麗に片付ける",
  categoryId: 1,
  iconId: 42,
  iconColor: "#FF5733",
  createdAt: "2026-03-15T10:00:00Z",
  updatedAt: "2026-03-15T10:00:00Z",
  details: [
    { 
      id: "550e8400-e29b-41d4-a716-446655440010",
      familyQuestId: "550e8400-e29b-41d4-a716-446655440001",
      level: 1,
      reward: 50,
      createdAt: "2026-03-15T10:00:00Z",
      updatedAt: "2026-03-15T10:00:00Z"
    },
    ...
  ]
}
```

**Errors**:
- `400 Bad Request`: バリデーションエラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない
- `500 Internal Server Error`: サーバーエラー

---

### GET /api/quests/family/[id]

**概要**: 家族クエスト詳細を取得

**認証**: 必須（家族メンバー）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | クエストID |

**Request Example**:
```http
GET /api/quests/family/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440001",
  familyId: "550e8400-e29b-41d4-a716-446655440000",
  parentId: "550e8400-e29b-41d4-a716-446655440002",
  title: "お部屋の片付け",
  description: "自分の部屋を綺麗に片付ける",
  categoryId: 1,
  iconId: 42,
  iconColor: "#FF5733",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  details: [
    { id: "...", level: 1, reward: 50, createdAt: "...", updatedAt: "..." },
    { id: "...", level: 2, reward: 70, createdAt: "...", updatedAt: "..." },
    { id: "...", level: 3, reward: 100, createdAt: "...", updatedAt: "..." }
  ]
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

**認証**: 必須（親ユーザーのみ、作成者または家族の親）

**Path Parameters**: `id` (uuid)

**Request Body** (部分更新可能):
```typescript
{
  title?: string
  description?: string
  categoryId?: number
  iconId?: number
  iconColor?: string
  levels?: [
    {
      id?: string       // 既存レベルの場合はID指定
      level: number
      reward: number
    }
  ]
}
```

**Response (200 OK)**: GET /api/quests/family/[id]と同じ形式

**Errors**:
- `400 Bad Request`: バリデーションエラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 更新権限なし
- `404 Not Found`: クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### DELETE /api/quests/family/[id]

**概要**: 家族クエストを削除

**認証**: 必須（親ユーザーのみ、作成者または家族の親）

**Path Parameters**: `id` (uuid)

**Request Example**:
```http
DELETE /api/quests/family/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (204 No Content)**: ボディなし

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 削除権限なし
- `404 Not Found`: クエストが存在しない
- `409 Conflict`: 子供クエストが存在する場合（削除不可）
- `500 Internal Server Error`: サーバーエラー

---

## 公開機能

### POST /api/quests/family/[id]/publish

**概要**: 家族クエストを公開クエストとして公開

**認証**: 必須（親ユーザーのみ）

**Path Parameters**: `id` (uuid)

**Request Example**:
```http
POST /api/quests/family/550e8400-e29b-41d4-a716-446655440001/publish
Authorization: Bearer <token>
```

**Response (201 Created or 200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440100",  // public_quests.id
  familyQuestId: "550e8400-e29b-41d4-a716-446655440001",
  familyId: "550e8400-e29b-41d4-a716-446655440000",
  isActive: true,
  totalLikes: 0,
  totalComments: 0,
  createdAt: "2026-03-15T10:00:00Z",
  updatedAt: "2026-03-15T10:00:00Z"
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 公開権限なし
- `404 Not Found`: クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### GET /api/quests/family/[id]/public

**概要**: 家族クエストに紐づく公開クエストを取得

**認証**: 必須

**Path Parameters**: `id` (uuid - family_quest.id)

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440100",
  familyQuestId: "550e8400-e29b-41d4-a716-446655440001",
  familyId: "550e8400-e29b-41d4-a716-446655440000",
  isActive: true,
  totalLikes: 42,
  totalComments: 15,
  createdAt: "2026-03-15T10:00:00Z",
  updatedAt: "2026-03-15T10:00:00Z"
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 公開クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

## 子供クエスト操作

### GET /api/quests/family/[id]/child/[childId]

**概要**: 子供クエストを取得（存在しない場合は自動生成）

**認証**: 必須（子供ユーザー本人または親）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 家族クエストID |
| childId | uuid | 子供ID |

**Request Example**:
```http
GET /api/quests/family/550e8400-e29b-41d4-a716-446655440001/child/550e8400-e29b-41d4-a716-446655440003
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440200",  // child_quests.id
  childId: "550e8400-e29b-41d4-a716-446655440003",
  familyQuestDetailId: "550e8400-e29b-41d4-a716-446655440010",  // レベル1のdetail
  status: "not_started",  // or "in_progress", "pending_review", "completed"
  startedAt: null,
  completedAt: null,
  reportedAt: null,
  reviewedAt: null,
  createdAt: "2026-03-15T10:00:00Z",
  updatedAt: "2026-03-15T10:00:00Z",
  quest: {  // 家族クエスト情報を含む
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "お部屋の片付け",
    description: "自分の部屋を綺麗に片付ける",
    iconId: 42,
    iconColor: "#FF5733"
  },
  detail: {  // 現在のレベル詳細
    level: 1,
    reward: 50
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: アクセス権限なし
- `404 Not Found`: 家族クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### POST /api/quests/family/[id]/review-request

**概要**: 子供が完了報告を行う

**認証**: 必須（子供ユーザー本人）

**Path Parameters**: `id` (uuid - family_quest.id)

**Request Body**:
```typescript
{
  childId: string  // 子供ID（必須）
}
```

**Request Example**:
```http
POST /api/quests/family/550e8400-e29b-41d4-a716-446655440001/review-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "childId": "550e8400-e29b-41d4-a716-446655440003"
}
```

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440200",
  status: "pending_review",
  reportedAt: "2026-03-15T11:00:00Z",
  updatedAt: "2026-03-15T11:00:00Z"
}
```

**Errors**:
- `400 Bad Request`: ステータスが`in_progress`でない
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 本人以外からのリクエスト
- `404 Not Found`: 子供クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### POST /api/quests/family/[id]/cancel-review

**概要**: 完了報告をキャンセル（子供が報告を取り下げ）

**認証**: 必須（子供ユーザー本人）

**Path Parameters**: `id` (uuid)

**Request Body**:
```typescript
{
  childId: string
}
```

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440200",
  status: "in_progress",
  reportedAt: null,
  updatedAt: "2026-03-15T11:30:00Z"
}
```

**Errors**:
- `400 Bad Request`: ステータスが`pending_review`でない
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 本人以外からのリクエスト
- `404 Not Found`: 子供クエストが存在しない

---

### POST /api/quests/family/[id]/child/[childId]/approve

**概要**: 親が完了報告を承認

**認証**: 必須（親ユーザーのみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 家族クエストID |
| childId | uuid | 子供ID |

**Request Example**:
```http
POST /api/quests/family/550e8400-e29b-41d4-a716-446655440001/child/550e8400-e29b-41d4-a716-446655440003/approve
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440200",
  status: "completed",
  completedAt: "2026-03-15T12:00:00Z",
  reviewedAt: "2026-03-15T12:00:00Z",
  reward: {
    amount: 50,
    rewardHistoryId: "550e8400-e29b-41d4-a716-446655440300"
  },
  child: {
    level: 5,
    exp: 1250,
    totalEarned: 3500,
    levelUp: false  // レベルアップした場合はtrue
  },
  nextQuest: {  // 次のレベルがある場合
    id: "550e8400-e29b-41d4-a716-446655440201",
    status: "not_started",
    detail: {
      level: 2,
      reward: 70
    }
  }
}
```

**Errors**:
- `400 Bad Request`: ステータスが`pending_review`でない
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない
- `404 Not Found`: 子供クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

### POST /api/quests/family/[id]/child/[childId]/reject

**概要**: 親が完了報告を却下

**認証**: 必須（親ユーザーのみ）

**Path Parameters**: id (uuid), childId (uuid)

**Request Body** (オプション):
```typescript
{
  reason?: string  // 却下理由（オプション、0-200文字）
}
```

**Request Example**:
```http
POST /api/quests/family/550e8400-e29b-41d4-a716-446655440001/child/550e8400-e29b-41d4-a716-446655440003/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "もう少し丁寧に片付けましょう"
}
```

**Response (200 OK)**:
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440200",
  status: "in_progress",
  reviewedAt: "2026-03-15T12:00:00Z",
  reason: "もう少し丁寧に片付けましょう"
}
```

**Errors**:
- `400 Bad Request`: ステータスが`pending_review`でない
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親ユーザーではない
- `404 Not Found`: 子供クエストが存在しない
- `500 Internal Server Error`: サーバーエラー

---

## クライアント側実装

### client.ts

APIクライアント関数を定義：
```typescript
// packages/web/app/api/quests/family/client.ts

export async function getFamilyQuests(familyId: string, options?: { limit?: number; offset?: number }) {
  const query = new URLSearchParams({
    familyId,
    limit: options?.limit?.toString() || '20',
    offset: options?.offset?.toString() || '0',
  })
  const response = await fetch(`/api/quests/family?${query}`)
  if (!response.ok) throw new Error('Failed to fetch family quests')
  return response.json()
}

export async function createFamilyQuest(data: CreateFamilyQuestRequest) {
  const response = await fetch('/api/quests/family', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create family quest')
  return response.json()
}

// その他のエンドポイント関数...
```

### query.ts

React Query フックを定義：
```typescript
// packages/web/app/api/quests/family/query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as client from './client'

export function useFamilyQuests(familyId: string) {
  return useQuery({
    queryKey: ['family-quests', familyId],
    queryFn: () => client.getFamilyQuests(familyId),
    enabled: !!familyId,
  })
}

export function useCreateFamilyQuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: client.createFamilyQuest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['family-quests', data.familyId] })
    },
  })
}

// その他のフック...
```

## データベース操作パターン

### 使用テーブル
- `family_quests`: 家族クエスト本体
- `family_quest_details`: レベル別報酬設定
- `child_quests`: 子供の受注・進捗情報
- `public_quests`: 公開クエスト
- `reward_history`: 報酬履歴
- `children`: 子供情報（報酬・レベル管理）
- `notifications`: 通知

### 操作原則
1. **低レベルクエリ使用**: Drizzle ORMの低レベルクエリ（`db.select()`, `db.insert()` etc.）を使用
2. **トランザクション**: 複数テーブル更新時は必ずトランザクションを使用
3. **排他制御**: 承認/却下処理では`FOR UPDATE`を使用
4. **Logger使用**: すべてのAPI処理でlogger（info, warn, error）を使用

### クエリ例

**クエスト一覧取得**:
```typescript
const quests = await db
  .select({
    id: familyQuestsTable.id,
    title: familyQuestsTable.title,
    // ... other fields
    details: sql<any>`json_agg(family_quest_details)`,
  })
  .from(familyQuestsTable)
  .leftJoin(familyQuestDetailsTable, eq(familyQuestsTable.id, familyQuestDetailsTable.familyQuestId))
  .where(eq(familyQuestsTable.familyId, familyId))
  .groupBy(familyQuestsTable.id)
```

**トランザクション例（承認処理）**:
```typescript
await db.transaction(async (tx) => {
  // 1. child_quests更新
  await tx.update(childQuestsTable)
    .set({ status: 'completed', completedAt: new Date(), reviewedAt: new Date() })
    .where(eq(childQuestsTable.id, childQuestId))
  
  // 2. reward_history追加
  await tx.insert(rewardHistoryTable)
    .values({ childId, rewardType: 'quest', amount: reward, sourceId: childQuestId })
  
  // 3. children更新（報酬加算・経験値）
  await tx.update(childrenTable)
    .set({ 
      totalEarned: sql`total_earned + ${reward}`,
      exp: sql`exp + ${reward}`,
    })
    .where(eq(childrenTable.id, childId))
})
```

## 注意点

### セキュリティ
- 認証チェック: すべてのエンドポイントでSupabase認証を確認
- 権限チェック: 家族メンバーであることを確認
- 親権限: 作成・更新・削除・承認/却下は親のみ
- 子供権限: 完了報告・キャンセルは本人のみ

### パフォーマンス
- キャッシュ: 詳細取得は5分TTL
- ページネーション: 一覧取得はlimit/offsetをサポート
- 非同期処理: 通知・タイムライン投稿は非同期実行

### エラーハンドリング
- Logger使用: すべてのエラーをlogger.errorで記録
- トランザクションロールバック: エラー時は自動ロールバック
- ユーザーへの詳細非表示: 内部エラー詳細は返さない
