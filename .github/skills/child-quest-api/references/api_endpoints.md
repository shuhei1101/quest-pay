(2026年3月15日 14:30記載)

# 子供クエストAPI エンドポイント詳細仕様

## エンドポイント一覧

| メソッド | パス | 説明 | 権限 |
|---------|------|------|------|
| GET | `/api/quests/child` | 子供クエスト一覧取得 | 子供本人または親 |
| GET | `/api/quests/child/[id]` | 子供クエスト詳細取得 | 子供本人または親 |
| POST | `/api/quests/family/[familyQuestId]/review-request` | 完了報告 | 子供本人のみ |
| POST | `/api/quests/family/[familyQuestId]/cancel-review` | 報告キャンセル | 子供本人のみ |
| POST | `/api/quests/family/[familyQuestId]/child/[childId]/approve` | 報告承認 | 親のみ |
| POST | `/api/quests/family/[familyQuestId]/child/[childId]/reject` | 報告却下 | 親のみ |

---

## GET /api/quests/child

子供クエスト一覧を取得します。

### リクエスト

**URL**: `/api/quests/child`

**Method**: `GET`

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| childId | uuid | Yes | 子供ID |
| status | enum | No | ステータスフィルター（not_started, in_progress, pending_review, completed） |
| limit | number | No | 取得件数（デフォルト: 20） |
| offset | number | No | オフセット（デフォルト: 0） |

**Headers**:
```
Authorization: Bearer <token>
```

### レスポンス

**Success (200 OK)**:
```json
{
  "quests": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "childId": "660e8400-e29b-41d4-a716-446655440001",
      "familyQuestDetailId": "770e8400-e29b-41d4-a716-446655440002",
      "familyQuestId": "880e8400-e29b-41d4-a716-446655440003",
      "title": "お風呂掃除",
      "description": "お風呂をきれいにする",
      "level": 1,
      "reward": 100,
      "status": "in_progress",
      "startedAt": "2026-03-14T10:00:00Z",
      "completedAt": null,
      "reportedAt": null,
      "reviewedAt": null,
      "createdAt": "2026-03-13T15:00:00Z",
      "updatedAt": "2026-03-14T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

**Error Responses**:
- `401 Unauthorized`: 認証情報が不正または欠如
- `403 Forbidden`: 権限なし（他の子供のクエストへのアクセス）
- `500 Internal Server Error`: サーバー内部エラー

### 使用例

```typescript
// APIクライアント呼び出し
import { getChildQuests } from '@/app/api/quests/child/client'

const quests = await getChildQuests({
  childId: '660e8400-e29b-41d4-a716-446655440001',
  status: 'in_progress'
})

// React Queryフック使用
import { useChildQuestsQuery } from '@/app/api/quests/child/query'

const { data, isLoading } = useChildQuestsQuery({
  childId: '660e8400-e29b-41d4-a716-446655440001',
  status: 'in_progress'
})
```

---

## GET /api/quests/child/[id]

子供クエストの詳細を取得します。

### リクエスト

**URL**: `/api/quests/child/[id]`

**Method**: `GET`

**Path Parameters**:
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | uuid | 子供クエストID |

**Headers**:
```
Authorization: Bearer <token>
```

### レスポンス

**Success (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "childId": "660e8400-e29b-41d4-a716-446655440001",
  "familyQuestDetailId": "770e8400-e29b-41d4-a716-446655440002",
  "familyQuestId": "880e8400-e29b-41d4-a716-446655440003",
  "title": "お風呂掃除",
  "description": "お風呂をきれいに掃除する。特に浴槽と床を重点的に。",
  "category": "家事手伝い",
  "level": 1,
  "reward": 100,
  "status": "in_progress",
  "startedAt": "2026-03-14T10:00:00Z",
  "completedAt": null,
  "reportedAt": null,
  "reviewedAt": null,
  "createdAt": "2026-03-13T15:00:00Z",
  "updatedAt": "2026-03-14T10:00:00Z",
  "icon": {
    "id": 5,
    "name": "cleaning",
    "color": "#4CAF50"
  },
  "child": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "太郎",
    "level": 3,
    "exp": 250,
    "totalEarned": 1500
  }
}
```

**Error Responses**:
- `401 Unauthorized`: 認証情報が不正または欠如
- `403 Forbidden`: 権限なし
- `404 Not Found`: 指定されたクエストが存在しない
- `500 Internal Server Error`: サーバー内部エラー

### 使用例

```typescript
// APIクライアント呼び出し
import { getChildQuestById } from '@/app/api/quests/child/client'

const quest = await getChildQuestById('550e8400-e29b-41d4-a716-446655440000')

// React Queryフック使用
import { useChildQuestQuery } from '@/app/api/quests/child/query'

const { data: quest, isLoading } = useChildQuestQuery('550e8400-e29b-41d4-a716-446655440000')
```

---

## POST /api/quests/family/[familyQuestId]/review-request

子供がクエストの完了を報告します。ステータスが `in_progress` → `pending_review` に遷移します。

### リクエスト

**URL**: `/api/quests/family/[familyQuestId]/review-request`

**Method**: `POST`

**Path Parameters**:
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| familyQuestId | uuid | 家族クエストID |

**Body**:
```json
{
  "childId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### レスポンス

**Success (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "childId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "pending_review",
  "reportedAt": "2026-03-14T15:30:00Z",
  "message": "完了報告を送信しました"
}
```

**Error Responses**:
- `401 Unauthorized`: 認証情報が不正または欠如
- `403 Forbidden`: 他の子供のクエストへの報告試行
- `409 Conflict`: 不正なステータス遷移（既に報告済みなど）
  ```json
  {
    "error": "既に完了報告されています",
    "currentStatus": "pending_review"
  }
  ```
- `500 Internal Server Error`: サーバー内部エラー

### ビジネスロジック

1. 子供本人確認（childId一致チェック）
2. 排他ロック取得
3. 現在のステータスが `in_progress` であることを確認
4. ステータスを `pending_review` に更新
5. `reported_at` に現在時刻を設定
6. 親に通知送信（type: `family_quest_review`）

### 使用例

```typescript
// APIクライアント呼び出し
import { requestReview } from '@/app/api/quests/family/client'

await requestReview(
  '880e8400-e29b-41d4-a716-446655440003', // familyQuestId
  { childId: '660e8400-e29b-41d4-a716-446655440001' }
)

// React Queryフック使用
import { useReviewRequestMutation } from '@/app/api/quests/family/query'

const { mutate: requestReview } = useReviewRequestMutation()

requestReview({
  familyQuestId: '880e8400-e29b-41d4-a716-446655440003',
  childId: '660e8400-e29b-41d4-a716-446655440001'
})
```

---

## POST /api/quests/family/[familyQuestId]/cancel-review

子供が完了報告をキャンセルします。ステータスが `pending_review` → `in_progress` に遷移します。

### リクエスト

**URL**: `/api/quests/family/[familyQuestId]/cancel-review`

**Method**: `POST`

**Path Parameters**:
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| familyQuestId | uuid | 家族クエストID |

**Body**:
```json
{
  "childId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### レスポンス

**Success (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "childId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "in_progress",
  "reportedAt": null,
  "message": "完了報告をキャンセルしました"
}
```

**Error Responses**:
- `401 Unauthorized`: 認証情報が不正または欠如
- `403 Forbidden`: 他の子供のクエストへのキャンセル試行
- `409 Conflict`: 不正なステータス遷移（報告中でない等）
- `500 Internal Server Error`: サーバー内部エラー

### 使用例

```typescript
// APIクライアント呼び出し
import { cancelReview } from '@/app/api/quests/family/client'

await cancelReview(
  '880e8400-e29b-41d4-a716-446655440003',
  { childId: '660e8400-e29b-41d4-a716-446655440001' }
)
```

---

## POST /api/quests/family/[familyQuestId]/child/[childId]/approve

親が子供の完了報告を承認します。報酬付与とレベルアップ処理も行われます。

### リクエスト

**URL**: `/api/quests/family/[familyQuestId]/child/[childId]/approve`

**Method**: `POST`

**Path Parameters**:
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| familyQuestId | uuid | 家族クエストID |
| childId | uuid | 子供ID |

**Body**:
```json
{
  "comment": "よくできました！（任意）"
}
```

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### レスポンス

**Success (200 OK)**:
```json
{
  "message": "承認しました",
  "childQuest": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "completedAt": "2026-03-14T16:00:00Z",
    "reviewedAt": "2026-03-14T16:00:00Z"
  },
  "reward": {
    "amount": 100,
    "totalEarned": 1600
  },
  "levelUp": {
    "occurred": true,
    "newLevel": 4,
    "exp": 50
  },
  "nextLevel": {
    "exists": true,
    "childQuestId": "990e8400-e29b-41d4-a716-446655440005",
    "level": 2,
    "reward": 150
  }
}
```

**Error Responses**:
- `401 Unauthorized`: 認証情報が不正または欠如
- `403 Forbidden`: 親以外のユーザーの承認試行
- `409 Conflict`: 不正なステータス遷移（承認待ちでない等）
- `500 Internal Server Error`: サーバー内部エラー

### ビジネスロジック

1. 親権限確認（family_quests.parent_id一致チェック）
2. 排他ロック取得
3. トランザクション開始
4. ステータスを `completed` に更新
5. `completed_at`, `reviewed_at` に現在時刻を設定
6. `reward_history` レコード作成
7. `children.total_earned` に報酬額加算
8. `children.exp` に報酬額加算
9. レベルアップ判定（`exp >= level * 100`）
   - レベルアップした場合: `children.level` を +1、タイムライン投稿
10. 次レベルの存在確認
    - 次レベルが存在: 新しい `child_quests` レコード作成（status: not_started）
    - 最終レベル: タイムライン投稿（quest_completed）
11. 子供に承認通知送信（type: `quest_report_approved`）
12. トランザクションコミット

### 使用例

```typescript
// APIクライアント呼び出し
import { approveQuest } from '@/app/api/quests/family/client'

const result = await approveQuest(
  '880e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440001',
  { comment: 'よくできました！' }
)

// React Queryフック使用
import { useApproveQuestMutation } from '@/app/api/quests/family/query'

const { mutate: approve } = useApproveQuestMutation()

approve({
  familyQuestId: '880e8400-e29b-41d4-a716-446655440003',
  childId: '660e8400-e29b-41d4-a716-446655440001',
  comment: 'よくできました！'
})
```

---

## POST /api/quests/family/[familyQuestId]/child/[childId]/reject

親が子供の完了報告を却下します。ステータスが `pending_review` → `in_progress` に遷移します。

### リクエスト

**URL**: `/api/quests/family/[familyQuestId]/child/[childId]/reject`

**Method**: `POST`

**Path Parameters**:
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| familyQuestId | uuid | 家族クエストID |
| childId | uuid | 子供ID |

**Body**:
```json
{
  "reason": "もう少し丁寧にやり直してね（任意）"
}
```

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### レスポンス

**Success (200 OK)**:
```json
{
  "message": "却下しました",
  "childQuest": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "in_progress",
    "reviewedAt": "2026-03-14T16:05:00Z"
  },
  "reason": "もう少し丁寧にやり直してね"
}
```

**Error Responses**:
- `401 Unauthorized`: 認証情報が不正または欠如
- `403 Forbidden`: 親以外のユーザーの却下試行
- `409 Conflict`: 不正なステータス遷移（承認待ちでない等）
- `500 Internal Server Error`: サーバー内部エラー

### ビジネスロジック

1. 親権限確認（family_quests.parent_id一致チェック）
2. 排他ロック取得
3. 現在のステータスが `pending_review` であることを確認
4. ステータスを `in_progress` に更新
5. `reviewed_at` に現在時刻を設定
6. 子供に却下通知送信（type: `quest_report_rejected`, reason付き）

### 使用例

```typescript
// APIクライアント呼び出し
import { rejectQuest } from '@/app/api/quests/family/client'

await rejectQuest(
  '880e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440001',
  { reason: 'もう少し丁寧にやり直してね' }
)

// React Queryフック使用
import { useRejectQuestMutation } from '@/app/api/quests/family/query'

const { mutate: reject } = useRejectQuestMutation()

reject({
  familyQuestId: '880e8400-e29b-41d4-a716-446655440003',
  childId: '660e8400-e29b-41d4-a716-446655440001',
  reason: 'もう少し丁寧にやり直してね'
})
```

---

## エラーレスポンス形式

すべてのエラーレスポンスは以下の形式に従います：

```json
{
  "error": "エラーメッセージ",
  "code": "ERROR_CODE",
  "details": {
    "field": "追加情報（任意）"
  }
}
```

### 共通エラーコード

| コード | HTTPステータス | 説明 |
|-------|---------------|------|
| UNAUTHORIZED | 401 | 認証情報が不正または欠如 |
| FORBIDDEN | 403 | 権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | 競合エラー（不正なステータス遷移等） |
| VALIDATION_ERROR | 400 | バリデーションエラー |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

---

## 排他制御とトランザクション

### ロック戦略

子供クエストの更新操作では、以下のロック戦略を使用します：

1. **楽観的ロック**: 通常の読み取り操作
2. **悲観的ロック**: 更新操作時に `FOR UPDATE` を使用
3. **分散ロック**: 複雑なトランザクション（承認処理等）では Redis ロック使用

### トランザクション境界

承認処理のような複数テーブルを更新する操作では、以下のトランザクション境界を設定：

```typescript
await db.transaction(async (tx) => {
  // 1. child_quests 更新
  // 2. reward_history 作成
  // 3. children 更新（報酬・経験値）
  // 4. レベルアップ判定・処理
  // 5. 次レベル child_quests 作成
  // すべて成功 → COMMIT
  // いずれか失敗 → ROLLBACK
})
```

---

## パフォーマンス最適化

### キャッシュ戦略

- **一覧取得**: Redis キャッシュ（TTL: 30秒）
- **詳細取得**: Redis キャッシュ（TTL: 5分）
- **更新操作**: キャッシュ無効化

### インデックス

以下のインデックスがパフォーマンス向上に寄与：

```sql
CREATE INDEX idx_child_quests_child_id ON child_quests(child_id);
CREATE INDEX idx_child_quests_status ON child_quests(status);
CREATE INDEX idx_child_quests_family_quest_detail_id ON child_quests(family_quest_detail_id);
CREATE INDEX idx_child_quests_child_status ON child_quests(child_id, status);
```

### N+1クエリ対策

一覧取得時は JOIN を使用して関連データを一括取得：

```typescript
const quests = await db
  .select()
  .from(childQuests)
  .innerJoin(familyQuestDetails, eq(childQuests.familyQuestDetailId, familyQuestDetails.id))
  .innerJoin(familyQuests, eq(familyQuestDetails.familyQuestId, familyQuests.id))
  .where(eq(childQuests.childId, childId))
```
