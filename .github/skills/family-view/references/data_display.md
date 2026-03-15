# 家族プロフィール閲覧画面 - データ表示パターン

**(2026年3月記載)**

## データ取得フック

### useFamilyDetail
**ファイル:** `app/(app)/families/[id]/view/_hooks/useFamilyProfile.ts`

**用途:** 家族詳細情報を取得

**返り値:**
```typescript
{
  familyDetail: {
    family: {
      onlineName: string | null
      localName: string | null
      displayId: string
      iconColor: string
      introduction: string
    }
    icon: {
      name: string
      size: number
    }
    followCount: {
      followerCount: number
      followingCount: number
    }
    stats: {
      publicQuestCount: number
      likeCount: number
    }
  }
  isLoading: boolean
}
```

**API:** `GET /api/families/[id]/profile`

### useFollowStatus
**用途:** フォロー状態を取得

**返り値:**
```typescript
{
  isFollowing: boolean
  isLoading: boolean
}
```

**API:** `GET /api/families/[id]/follow/status`

### useFollowToggle
**用途:** フォロー/フォロー解除

**返り値:**
```typescript
{
  follow: () => void
  unfollow: () => void
  isLoading: boolean
}
```

**API:** 
- `POST /api/families/[id]/follow` (フォロー)
- `DELETE /api/families/[id]/follow` (解除)

### useFamilyTimeline
**用途:** 家族タイムラインを取得

**返り値:**
```typescript
{
  timelines: Array<{
    family_timeline: {
      message: string
      createdAt: string
    }
  }>
  isLoading: boolean
}
```

**API:** `GET /api/families/[id]/timeline`

## 表示データ構造

### ヘッダー情報
| 項目 | データソース | 表示形式 | フォールバック |
|------|--------------|----------|---------------|
| 家族名 | `familyDetail.family.onlineName` または `localName` | テキスト | null |
| 表示ID | `familyDetail.family.displayId` | `@displayId` 形式 | `""` |
| アイコン | `familyDetail.icon.name` | RenderIcon | undefined |
| アイコンサイズ | `familyDetail.icon.size` | 数値 | undefined |
| アイコン色 | `familyDetail.family.iconColor` | カラーコード | `"#000000"` |

### 統計情報
| 項目 | データソース | 表示形式 | デフォルト値 |
|------|--------------|----------|-------------|
| フォロワー数 | `familyDetail.followCount.followerCount` | 数値 | 0 |
| フォロー数 | `familyDetail.followCount.followingCount` | 数値 | 0 |
| 公開クエスト数 | `familyDetail.stats.publicQuestCount` | 数値 | 0 |
| いいね数 | `familyDetail.stats.likeCount` | 数値 | 0 |

### プロフィール情報
| 項目 | データソース | 表示形式 | デフォルト値 |
|------|--------------|----------|-------------|
| 自己紹介 | `familyDetail.family.introduction` | マルチラインテキスト | `""` |

### タイムライン情報
| 項目 | データソース | 表示形式 | 変換処理 |
|------|--------------|----------|---------|
| メッセージ | `timeline.family_timeline.message` | テキスト | `""` |
| 時刻 | `timeline.family_timeline.createdAt` | 相対時刻 | `formatTime()` |

## データ整形処理

### 家族名の優先順位
```typescript
familyName={familyDetail?.family?.onlineName ?? familyDetail?.family?.localName ?? null}
```

**優先順位:**
1. `onlineName`（オンライン表示名）
2. `localName`（ローカル名）
3. `null`

### タイムラインの整形
```typescript
const formattedTimelines = timelines.map((timeline) => {
  const timelineData = timeline.family_timeline
  return {
    message: timelineData?.message || "",
    time: timelineData?.createdAt ? formatTime(timelineData.createdAt) : "",
  }
})
```

**処理内容:**
- `message`: タイムラインメッセージ（空文字フォールバック）
- `time`: 相対時刻に変換（`formatTime`ユーティリティ使用）

### 自家族判定
```typescript
const isOwnFamily = userInfo?.profiles?.familyId === id
```

**判定ロジック:**
- ログインユーザーの `familyId` と画面の家族IDを比較
- 一致する場合: `true`（自家族）
- 一致しない場合: `false`（他家族）

## フォローボタンの状態

### 表示条件
| 条件 | 表示 | 動作 |
|------|------|------|
| `isOwnFamily === true` | 非表示 | - |
| `isOwnFamily === false && isFollowing === true` | 「フォロー解除」 | `unfollow()` |
| `isOwnFamily === false && isFollowing === false` | 「フォローする」 | `follow()` |

### ローディング状態
```typescript
isLoading={isFamilyLoading || isFollowLoading || isTimelineLoading || isFollowToggleLoading}
```

**統合ローディング:**
- 家族詳細取得中
- フォロー状態取得中
- タイムライン取得中
- フォロー切り替え中

いずれかが `true` の場合、画面全体にローディングオーバーレイ表示

## Null Safety とデフォルト値

### Optional Chaining使用例
```typescript
familyName={familyDetail?.family?.onlineName ?? familyDetail?.family?.localName ?? null}
iconName={familyDetail?.icon?.name}
followerCount={familyDetail?.followCount?.followerCount ?? 0}
```

### Nullish Coalescing Operator (`??`)
- `null` または `undefined` の場合のみデフォルト値を使用
- `0`、`""`、`false` は有効な値として扱う

### Logical OR Operator (`||`)
```typescript
message: timelineData?.message || ""
```

- Falsy値（`null`、`undefined`、`""`、`0`、`false`）の場合にデフォルト値を使用

## formatTime ユーティリティ

**ファイル:** `app/(core)/util.ts`

**用途:** 相対時刻の表示

**例:**
- `"2分前"`
- `"5時間前"`
- `"3日前"`
- `"2024/03/15"`
