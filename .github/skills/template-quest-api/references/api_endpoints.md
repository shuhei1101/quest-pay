# テンプレートクエスト API エンドポイント詳細

(2026年3月15日 14:30記載)

## API 一覧

| メソッド | エンドポイント | 説明 | 権限 |
|---------|--------------|------|------|
| GET | `/api/quests/template` | テンプレート一覧取得 | 親 |
| GET | `/api/quests/template/[id]` | テンプレート詳細取得 | 親 |

---

## GET /api/quests/template

テンプレートクエストの一覧を取得します。

### リクエスト

**Query Parameters:**
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| category | string | No | カテゴリーでフィルター |
| difficulty | number | No | 難易度でフィルター (1-5) |
| tags | string[] | No | タグ配列でフィルター |

**例:**
```
GET /api/quests/template
GET /api/quests/template?category=家事
GET /api/quests/template?difficulty=2
GET /api/quests/template?category=家事&difficulty=2&tags=整理整頓&tags=日常
```

### レスポンス

**成功 (200 OK):**
```typescript
{
  templates: Array<{
    id: string
    title: string
    description: string
    category: string
    difficulty: number // 1-5
    estimatedMinutes: number
    tags: string[]
    isActive: boolean
    details: Array<{
      level: number // 1-10
      detailDescription: string
      rewardAmountMin: number
      rewardAmountMax: number
      experiencePoints: number
    }>
  }>
}
```

**例:**
```json
{
  "templates": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "お部屋の片付け",
      "description": "自分の部屋をきれいに片付ける",
      "category": "家事",
      "difficulty": 2,
      "estimatedMinutes": 30,
      "tags": ["整理整頓", "日常"],
      "isActive": true,
      "details": [
        {
          "level": 1,
          "detailDescription": "おもちゃを箱に入れる",
          "rewardAmountMin": 50,
          "rewardAmountMax": 100,
          "experiencePoints": 10
        }
      ]
    }
  ]
}
```

**エラー:**
- `401 Unauthorized`: 認証されていない
- `403 Forbidden`: 親権限がない

### DB操作

```typescript
// 基本クエリ
const templates = await db
  .select()
  .from(templateQuests)
  .where(eq(templateQuests.isActive, true))

// フィルター適用例
if (category) {
  query = query.where(eq(templateQuests.category, category))
}

if (difficulty) {
  query = query.where(eq(templateQuests.difficulty, difficulty))
}

// 詳細情報取得
const details = await db
  .select()
  .from(templateQuestDetails)
  .where(inArray(templateQuestDetails.templateQuestId, templateIds))
  .orderBy(asc(templateQuestDetails.level))
```

---

## GET /api/quests/template/[id]

特定のテンプレートクエストの詳細を取得します。

### リクエスト

**Path Parameters:**
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| id | uuid | Yes | テンプレートID |

**例:**
```
GET /api/quests/template/550e8400-e29b-41d4-a716-446655440000
```

### レスポンス

**成功 (200 OK):**
```typescript
{
  template: {
    id: string
    title: string
    description: string
    category: string
    difficulty: number
    estimatedMinutes: number
    tags: string[]
    isActive: boolean
    createdAt: string // ISO 8601
    updatedAt: string // ISO 8601
    details: Array<{
      level: number
      detailDescription: string
      rewardAmountMin: number
      rewardAmountMax: number
      experiencePoints: number
    }>
  }
}
```

**例:**
```json
{
  "template": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "お部屋の片付け",
    "description": "自分の部屋をきれいに片付ける",
    "category": "家事",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "tags": ["整理整頓", "日常"],
    "isActive": true,
    "createdAt": "2026-01-15T09:00:00Z",
    "updatedAt": "2026-03-01T10:30:00Z",
    "details": [
      {
        "level": 1,
        "detailDescription": "おもちゃを箱に入れる",
        "rewardAmountMin": 50,
        "rewardAmountMax": 100,
        "experiencePoints": 10
      },
      {
        "level": 2,
        "detailDescription": "おもちゃの整理と床の掃除",
        "rewardAmountMin": 80,
        "rewardAmountMax": 150,
        "experiencePoints": 15
      }
    ]
  }
}
```

**エラー:**
- `401 Unauthorized`: 認証されていない
- `403 Forbidden`: 親権限がない
- `404 Not Found`: テンプレートが存在しないか is_active = false

### DB操作

```typescript
// テンプレート取得
const template = await db
  .select()
  .from(templateQuests)
  .where(
    and(
      eq(templateQuests.id, id),
      eq(templateQuests.isActive, true)
    )
  )
  .limit(1)

if (!template) {
  return { error: 'テンプレートが見つかりません', status: 404 }
}

// 詳細情報取得
const details = await db
  .select()
  .from(templateQuestDetails)
  .where(eq(templateQuestDetails.templateQuestId, id))
  .orderBy(asc(templateQuestDetails.level))
```

---

## 共通仕様

### 認証
すべてのエンドポイントで Supabase 認証が必要です。

### 権限
親（role = 'parent'）のみがアクセス可能です。

### レート制限
標準的なレート制限が適用されます（詳細はシステム設定参照）。

### ページネーション
現状は全件取得ですが、将来的にページネーション対応予定。

---

## 実装ファイル

### API Routes
- `packages/web/app/api/quests/template/route.ts`: 一覧取得
- `packages/web/app/api/quests/template/[id]/route.ts`: 詳細取得

### クライアント側
- `packages/web/app/api/quests/template/client.ts`: APIクライアント関数
- `packages/web/app/api/quests/template/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: template_quests, template_quest_details

---

## 採用機能との連携

テンプレートの採用（family_questへの変換）は以下のAPIで実装：
- **採用**: `POST /api/quests/family/adopt` (family-quest-api参照)

採用時のデータ変換例：
```typescript
// template_quests → family_quests
{
  familyId: currentFamilyId, // 現在の家族ID
  title: template.title,
  description: template.description,
  category: template.category,
  difficulty: template.difficulty,
  estimatedMinutes: template.estimatedMinutes,
  tags: template.tags,
  sourceType: 'template', // 元がテンプレートであることを記録
  sourceId: template.id
}

// template_quest_details → family_quest_details
{
  familyQuestId: newFamilyQuestId,
  level: detail.level,
  detailDescription: detail.detailDescription,
  rewardAmount: detail.rewardAmountMin, // 初期値は最小値
  experiencePoints: detail.experiencePoints
}
```
