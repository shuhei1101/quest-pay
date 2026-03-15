# 公開クエスト閲覧画面 - データ表示パターン

**(2026年3月記載)**

## データ取得フック

### usePublicQuest
**ファイル:** `app/(app)/quests/public/[id]/view/_hooks/usePublicQuest.ts`

**用途:** 公開クエスト詳細情報を取得

**返り値:**
```typescript
{
  publicQuest: {
    quest: {
      name: string
      iconColor?: string
      client?: string
      requestDetail?: string
      ageFrom?: number
      ageTo?: number
      monthFrom?: number
      monthTo?: number
    }
    icon: {
      name: string
      size: number
    }
    familyIcon: {
      name: string
    }
    details: Array<{
      level: number
      successCondition: string
      reward: number
      childExp: number
      requiredCompletionCount: number
      requiredClearCount: number | null
    }>
    tags: Array<{
      name: string
    }>
  }
  isLoading: boolean
}
```

**API:** `GET /api/quests/public/[id]`

### useLikeCount
**用途:** いいね数を取得

**返り値:**
```typescript
{
  likeCount: number
}
```

**API:** `GET /api/quests/public/[id]/likes/count`

### useIsLike
**用途:** ログインユーザーのいいね状態を取得

**返り値:**
```typescript
{
  isLike: boolean
}
```

**API:** `GET /api/quests/public/[id]/likes/status`

### useCommentsCount
**用途:** コメント数を取得

**返り値:**
```typescript
{
  count: number
}
```

**API:** `GET /api/quests/public/[id]/comments/count`

### usePublicQuestComments
**用途:** コメント一覧を取得

**返り値:**
```typescript
{
  comments: Array<{
    id: string
    content: string
    createdAt: string
    likeCount: number
    isUpvoted: boolean
    isDownvoted: boolean
    isPinned: boolean
    hasPublisherLike: boolean
    user: {
      name: string
      icon?: string
    }
  }>
  refetch: () => void
}
```

**API:** `GET /api/quests/public/[id]/comments`

## 表示データ構造

### ヘッダー情報
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| クエスト名 | `publicQuest.quest.name` | テキスト |
| アイコン | `publicQuest.icon.name` | RenderIcon コンポーネント |
| アイコンサイズ | `publicQuest.icon.size` | 数値（デフォルト: 48） |
| アイコン色 | `publicQuest.quest.iconColor` | カラーコード |

### クエスト条件タブ
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| レベル | `selectedDetail.level` | 数値 |
| 成功条件 | `selectedDetail.successCondition` | テキスト |
| 報酬 | `selectedDetail.reward` | 数値（円） |
| 経験値 | `selectedDetail.childExp` | 数値 |
| 必須完了回数 | `selectedDetail.requiredCompletionCount` | 数値 |
| 前提クリア回数 | `selectedDetail.requiredClearCount` | 数値 または null |
| 対象年齢 | `quest.ageFrom`, `quest.ageTo` | "◯歳〜◯歳" |
| 対象月齢 | `quest.monthFrom`, `quest.monthTo` | "◯ヶ月〜◯ヶ月" |

### 依頼情報タブ
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| クライアント | `publicQuest.quest.client` | テキスト |
| 詳細説明 | `publicQuest.quest.requestDetail` | マルチラインテキスト |

### その他タブ
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| タグ | `publicQuest.tags` | Chip配列 |

### FABボタンの表示
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| いいね数 | `likeCount` | Indicator（バッジ） |
| いいね状態 | `isLike` | IconHeart（塗りつぶし） or IconHeartFilled |
| コメント数 | `commentCount` | Indicator（バッジ） |
| 選択レベル | `selectedLevel` | Indicator（バッジ） |
| 家族アイコン | `publicQuest.familyIcon.name` | RenderIcon |

## コメントデータ構造

### コメント一覧表示
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| ユーザー名 | `comment.user.name` | テキスト |
| ユーザーアイコン | `comment.user.icon` | RenderIcon |
| コメント本文 | `comment.content` | テキスト |
| 投稿日時 | `comment.createdAt` | 相対時刻（formatTime） |
| いいね数 | `comment.likeCount` | 数値 |
| 高評価状態 | `comment.isUpvoted` | ボタンの色変更 |
| 低評価状態 | `comment.isDownvoted` | ボタンの色変更 |
| ピン留め | `comment.isPinned` | ピンアイコン表示 |
| 公開者いいね | `comment.hasPublisherLike` | バッジ表示 |

### コメントソート
| ソートタイプ | 並び順 |
|-------------|--------|
| newest | 新しい順（createdAt DESC） |
| likes | いいね順（likeCount DESC） |

## レベル選択ロジック

### 選択中レベルの決定
```typescript
// デフォルトはレベル1
const [selectedLevel, setSelectedLevel] = useState<number>(1)

// 選択中レベルの詳細を取得
const selectedDetail = publicQuest?.details?.find(d => d.level === selectedLevel) 
  || publicQuest?.details?.[0]

// 利用可能なレベル一覧
const availableLevels = publicQuest?.details
  ?.map(d => d.level)
  .filter((level): level is number => level !== null && level !== undefined) 
  || []
```

### 複数レベル表示条件
- `availableLevels.length > 1` の場合のみレベル選択ボタンを表示
- レベル選択メニューはポップアップで表示

## いいね操作

### いいね切り替えロジック
```typescript
const likeToggleHandle = () => {
  if (isLike) {
    // いいねされている場合、いいねを取り消す
    handleCancelLike({ publicQuestId: id })
  } else {
    // いいねされていない場合、いいねする
    handleLike({ publicQuestId: id })
  }
}
```

### いいねボタンの表示
```typescript
<Indicator label={likeCount || 0} size={18} color="red" offset={4}>
  {isLike ? (
    <IconHeartFilled size={20} />
  ) : (
    <IconHeart size={20} />
  )}
</Indicator>
```

## コメント操作権限

### 操作可能なアクション
| アクション | 条件 |
|-----------|------|
| コメント投稿 | すべてのユーザー |
| 高評価・低評価 | すべてのユーザー |
| 報告 | すべてのユーザー |
| 削除 | 自分のコメントのみ（`isOwnComment === true`） |
| ピン留め | 公開者のみ（`isPublisher === true`） |
| 公開者いいね | 公開者のみ（`isPublisher === true`） |

### 自コメント判定
```typescript
const isOwnComment = comment.userId === userInfo?.profiles?.id
```

### 公開者判定
```typescript
const isPublisher = publicQuest?.familyId === userInfo?.profiles?.familyId
```

## デフォルト値とフォールバック

### 空データ時の表示
```typescript
questName={publicQuest?.quest?.name || ""}
iconSize={publicQuest?.icon?.size ?? 48}
level={selectedDetail?.level || 1}
reward={selectedDetail?.reward || 0}
exp={selectedDetail?.childExp || 0}
tags={publicQuest?.tags?.map(tag => tag.name) || []}
likeCount={likeCount || 0}
commentCount={commentCount || 0}
```

### null チェックと Optional Chaining
- オブジェクトへのアクセスは `?.` を使用
- 配列操作は `|| []` でフォールバック
- 数値は `|| 0` または `?? デフォルト値` を使用
