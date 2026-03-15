(2026年3月15日 14:30記載)

# タイムラインAPI エンドポイント詳細

## ファイル構成

```
packages/web/app/api/timeline/
├── db.ts                           # DB操作関数
├── family/
│   ├── route.ts                    # GET（一覧）
│   ├── client.ts                   # APIクライアント
│   ├── query.ts                    # React Queryフック
│   └── [id]/
│       ├── route.ts                # GET（詳細）
│       └── client.ts               # APIクライアント
└── public/
    ├── route.ts                    # GET（一覧）
    ├── client.ts                   # APIクライアント
    └── query.ts                    # React Queryフック
```

## 家族タイムライン操作

### GET /api/timeline/family

**概要**: 家族タイムライン一覧を取得

**認証**: 必須（家族メンバー）

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| なし | - | - | 認証済みユーザーの家族IDを自動取得 |

**Request Example**:
```http
GET /api/timeline/family
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  timelines: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      type: "quest_completed",
      profileId: "550e8400-e29b-41d4-a716-446655440002",
      message: "太郎くんがクエスト「お部屋の片付け」を完了しました！",
      url: "/quests/family/550e8400-e29b-41d4-a716-446655440003",
      createdAt: "2026-03-15T10:00:00Z",
      updatedAt: "2026-03-15T10:00:00Z",
      profile: {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "太郎",
        type: "child"
      },
      family: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        localName: "田中家",
        onlineName: "頑張る田中家"
      }
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      type: "savings_milestone_reached",
      profileId: "550e8400-e29b-41d4-a716-446655440002",
      message: "太郎くんの貯金額が1000円を突破しました！🎉",
      url: "/children/550e8400-e29b-41d4-a716-446655440002",
      createdAt: "2026-03-14T15:30:00Z",
      updatedAt: "2026-03-14T15:30:00Z",
      profile: {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "太郎",
        type: "child"
      },
      family: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        localName: "田中家",
        onlineName: "頑張る田中家"
      }
    }
  ]
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `500 Internal Server Error`: 家族ID取得失敗またはサーバーエラー

---

### GET /api/timeline/family/[id]

**概要**: 特定の家族タイムライン詳細を取得

**認証**: 必須（家族メンバー）

**Path Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | uuid | Yes | タイムラインID |

**Request Example**:
```http
GET /api/timeline/family/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  timeline: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    familyId: "550e8400-e29b-41d4-a716-446655440000",
    type: "quest_completed",
    profileId: "550e8400-e29b-41d4-a716-446655440002",
    message: "太郎くんがクエスト「お部屋の片付け」を完了しました！",
    url: "/quests/family/550e8400-e29b-41d4-a716-446655440003",
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
    profile: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "太郎",
      type: "child",
      birthDate: "2015-04-01"
    },
    family: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      localName: "田中家",
      onlineName: "頑張る田中家",
      displayId: "tanaka-family"
    }
  }
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: タイムラインが存在しない
- `500 Internal Server Error`: サーバーエラー

---

## 公開タイムライン操作

### GET /api/timeline/public

**概要**: 公開タイムライン一覧を取得（全家族の公開アクティビティ）

**認証**: 必須

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| なし | - | - | 全公開タイムラインを取得 |

**Request Example**:
```http
GET /api/timeline/public
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  timelines: [
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      type: "quest_published",
      message: "「お部屋の片付け」クエストを公開しました！",
      url: "/quests/public/550e8400-e29b-41d4-a716-446655440006",
      createdAt: "2026-03-15T12:00:00Z",
      updatedAt: "2026-03-15T12:00:00Z",
      family: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        onlineName: "頑張る田中家",
        displayId: "tanaka-family"
      }
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440007",
      familyId: "550e8400-e29b-41d4-a716-446655440000",
      type: "likes_milestone_reached",
      message: "公開クエストが100いいね達成しました！🎉",
      url: "/quests/public/550e8400-e29b-41d4-a716-446655440006",
      createdAt: "2026-03-14T18:30:00Z",
      updatedAt: "2026-03-14T18:30:00Z",
      family: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        onlineName: "頑張る田中家",
        displayId: "tanaka-family"
      }
    }
  ]
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `500 Internal Server Error`: サーバーエラー

---

## アクションタイプ別メッセージ例

### 家族タイムラインアクションタイプ

| タイプ | メッセージ例 | URL例 |
|--------|-------------|-------|
| quest_created | "「お部屋の片付け」クエストを作成しました" | `/quests/family/{questId}` |
| quest_completed | "{子供名}がクエスト「{クエスト名}」を完了しました" | `/quests/family/{questId}` |
| quest_cleared | "{子供名}がクエスト「{クエスト名}」をクリアしました！🎉" | `/quests/family/{questId}` |
| quest_level_up | "{子供名}がレベル{level}に上がりました！" | `/children/{childId}` |
| child_joined | "{子供名}が家族に参加しました" | `/children/{childId}` |
| parent_joined | "{親名}が家族に参加しました" | `/families/{familyId}` |
| reward_received | "{子供名}が{amount}円の報酬を受け取りました" | `/children/{childId}` |
| savings_updated | "{子供名}の貯金額が{amount}円になりました" | `/children/{childId}` |
| savings_milestone_reached | "{子供名}の貯金額が{milestone}円を突破しました！🎉" | `/children/{childId}` |
| quest_milestone_reached | "{子供名}が{count}回目のクエスト達成！🎉" | `/children/{childId}` |
| comment_posted | "{ユーザー名}がコメントしました" | `/quests/family/{questId}#comment-{commentId}` |

### 公開タイムラインアクションタイプ

| タイプ | メッセージ例 | URL例 |
|--------|-------------|-------|
| quest_published | "「{クエスト名}」クエストを公開しました" | `/quests/public/{questId}` |
| likes_milestone_reached | "公開クエストが{count}いいね達成しました！🎉" | `/quests/public/{questId}` |
| posts_milestone_reached | "{count}個目のクエストを公開しました！🎉" | `/families/{familyId}/public-quests` |
| comments_milestone_reached | "公開クエストに{count}件目のコメントが付きました！" | `/quests/public/{questId}` |
| comment_posted | "公開クエストにコメントが付きました" | `/quests/public/{questId}#comment-{commentId}` |
| like_received | "公開クエストにいいねが付きました" | `/quests/public/{questId}` |

---

## データベース操作関数

### insertFamilyTimeline

**概要**: 家族タイムラインを挿入

**ファイル**: `packages/web/app/api/timeline/db.ts`

**Parameters**:
```typescript
{
  db: Db                          // Supabase DB接続
  record: FamilyTimelineInsert    // タイムラインレコード
}

type FamilyTimelineInsert = {
  familyId: string
  type: family_timeline_action_type
  profileId: string
  message: string
  url?: string
}
```

**Returns**:
```typescript
{
  id: string  // 作成されたタイムラインID
}
```

**使用例**:
```typescript
await insertFamilyTimeline({
  db,
  record: {
    familyId: "550e8400-e29b-41d4-a716-446655440000",
    type: "quest_completed",
    profileId: "550e8400-e29b-41d4-a716-446655440002",
    message: "太郎くんがクエスト「お部屋の片付け」を完了しました！",
    url: "/quests/family/550e8400-e29b-41d4-a716-446655440003"
  }
})
```

---

### insertPublicTimeline

**概要**: 公開タイムラインを挿入

**ファイル**: `packages/web/app/api/timeline/db.ts`

**Parameters**:
```typescript
{
  db: Db                          // Supabase DB接続
  record: PublicTimelineInsert    // タイムラインレコード
}

type PublicTimelineInsert = {
  familyId: string
  type: public_timeline_action_type
  message: string
  url?: string
}
```

**Returns**:
```typescript
{
  id: string  // 作成されたタイムラインID
}
```

**使用例**:
```typescript
await insertPublicTimeline({
  db,
  record: {
    familyId: "550e8400-e29b-41d4-a716-446655440000",
    type: "quest_published",
    message: "「お部屋の片付け」クエストを公開しました！",
    url: "/quests/public/550e8400-e29b-41d4-a716-446655440006"
  }
})
```

---

## クライアント側 API呼び出し

### getFamilyTimelines

**ファイル**: `packages/web/app/api/timeline/family/client.ts`

**使用例**:
```typescript
import { getFamilyTimelines } from "@/app/api/timeline/family/client"

const { timelines } = await getFamilyTimelines()
```

### getFamilyTimelineById

**ファイル**: `packages/web/app/api/timeline/family/[id]/client.ts`

**使用例**:
```typescript
import { getFamilyTimelineById } from "@/app/api/timeline/family/[id]/client"

const { timeline } = await getFamilyTimelineById(timelineId)
```

### getPublicTimelines

**ファイル**: `packages/web/app/api/timeline/public/client.ts`

**使用例**:
```typescript
import { getPublicTimelines } from "@/app/api/timeline/public/client"

const { timelines } = await getPublicTimelines()
```

---

## React Query フック

### useFamilyTimelines

**ファイル**: `packages/web/app/api/timeline/family/query.ts`

**使用例**:
```typescript
import { useFamilyTimelines } from "@/app/api/timeline/family/query"

const MyComponent = () => {
  const { data, isLoading, error } = useFamilyTimelines()
  
  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラー: {error.message}</div>
  
  return (
    <div>
      {data.timelines.map(timeline => (
        <TimelineItem key={timeline.id} timeline={timeline} />
      ))}
    </div>
  )
}
```

### usePublicTimelines

**ファイル**: `packages/web/app/api/timeline/public/query.ts`

**使用例**:
```typescript
import { usePublicTimelines } from "@/app/api/timeline/public/query"

const MyComponent = () => {
  const { data, isLoading, error } = usePublicTimelines()
  
  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラー: {error.message}</div>
  
  return (
    <div>
      {data.timelines.map(timeline => (
        <TimelineItem key={timeline.id} timeline={timeline} />
      ))}
    </div>
  )
}
```

---

## 実装パターン

### タイムライン投稿の作成タイミング

1. **クエスト完了承認時**
```typescript
// クエスト承認後
await insertFamilyTimeline({
  db,
  record: {
    familyId,
    type: "quest_completed",
    profileId: childProfileId,
    message: `${childName}がクエスト「${questName}」を完了しました`,
    url: `/quests/family/${questId}`
  }
})

// クエストクリア時（最終レベル完了）
if (isQuestCleared) {
  await insertFamilyTimeline({
    db,
    record: {
      familyId,
      type: "quest_cleared",
      profileId: childProfileId,
      message: `${childName}がクエスト「${questName}」をクリアしました！🎉`,
      url: `/quests/family/${questId}`
    }
  })
}
```

2. **報酬付与時**
```typescript
// 報酬付与後
await insertFamilyTimeline({
  db,
  record: {
    familyId,
    type: "reward_received",
    profileId: childProfileId,
    message: `${childName}が${amount}円の報酬を受け取りました`,
    url: `/children/${childId}`
  }
})
```

3. **マイルストーン達成時**
```typescript
// 貯金額マイルストーン
if ([100, 500, 1000, 5000, 10000].includes(newSavings)) {
  await insertFamilyTimeline({
    db,
    record: {
      familyId,
      type: "savings_milestone_reached",
      profileId: childProfileId,
      message: `${childName}の貯金額が${newSavings}円を突破しました！🎉`,
      url: `/children/${childId}`
    }
  })
}
```

---

## エラーハンドリング

### クライアント側

```typescript
try {
  const { timelines } = await getFamilyTimelines()
} catch (error) {
  if (error instanceof AppError) {
    // アプリケーションエラー
    console.error(error.message)
  } else {
    // 予期しないエラー
    console.error("予期しないエラーが発生しました")
  }
}
```

### サーバー側

```typescript
// withRouteErrorHandling が自動的にエラーをキャッチして適切なレスポンスを返す
export async function GET() {
  return withRouteErrorHandling(async () => {
    // エラーがスローされた場合、自動的に処理される
    const timelines = await fetchFamilyTimelines({ db, familyId })
    return NextResponse.json({ timelines })
  })
}
```
