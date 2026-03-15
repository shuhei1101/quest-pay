# 家族プロフィール閲覧画面 - コンポーネント構造

**(2026年3月記載)**

## ファイル構成

### メイン画面コンポーネント
```
app/(app)/families/[id]/view/
├── page.tsx                          # ルートページ（authGuard + リダイレクト）
├── FamilyProfileViewScreen.tsx       # プロフィール画面メイン（ビジネスロジック）
└── _components/
    ├── FamilyProfileViewLayout.tsx   # レイアウト（プレゼンテーション）
    └── FamilyProfileViewFooter.tsx   # フッター
```

### フック
```
app/(app)/families/[id]/view/_hooks/
└── useFamilyProfile.ts               # 家族プロフィール関連フック
    ├── useFamilyDetail              # 家族詳細取得
    ├── useFollowStatus              # フォロー状態取得
    ├── useFollowToggle              # フォロー切り替え
    └── useFamilyTimeline            # タイムライン取得
```

## コンポーネント階層

```
FamilyProfileViewScreen (Container)
├── FamilyProfileViewLayout (Presentation)
│   ├── Header Section
│   │   ├── 家族アイコン（RenderIcon）
│   │   ├── 家族名（オンライン名 or ローカル名）
│   │   └── 表示ID (@displayId)
│   ├── Stats Section
│   │   ├── フォロワー数
│   │   ├── フォロー数
│   │   ├── 公開クエスト数
│   │   └── いいね数
│   ├── Introduction Section
│   │   └── 自己紹介文
│   ├── Follow Button (他家族の場合)
│   │   └── フォロー/フォロー解除ボタン
│   ├── Timeline Section
│   │   └── タイムライン一覧
│   └── Loading Overlay
└── FamilyProfileViewFooter
    └── フッターコンテンツ
```

## 主要コンポーネント詳細

### FamilyProfileViewScreen
**責務:** ビジネスロジック、状態管理、データ取得

**主要機能:**
- 家族詳細情報の取得（useFamilyDetail）
- フォロー状態の取得（useFollowStatus）
- フォロー切り替え（useFollowToggle）
- タイムライン取得（useFamilyTimeline）
- 自家族判定ロジック
- タイムラインデータの整形

**Props:**
```typescript
{
  id: string  // 家族ID
}
```

**State（フック経由）:**
- `familyDetail`: 家族詳細情報
- `isFollowing`: フォロー状態
- `timelines`: タイムライン一覧
- `isOwnFamily`: 自分の家族かどうか

### FamilyProfileViewLayout
**責務:** プレゼンテーション、情報表示

**Props:**
```typescript
{
  familyName: string | null
  displayId: string
  iconName?: string
  iconSize?: number
  iconColor?: string
  introduction: string
  followerCount: number
  followingCount: number
  publicQuestCount: number
  likeCount: number
  timelines: Array<{
    message: string
    time: string
  }>
  isLoading: boolean
  isOwnFamily: boolean
  isFollowing: boolean
  onFollowClick: () => void
  footer: React.ReactNode
}
```

### FamilyProfileViewFooter
**責務:** フッター表示

**主要機能:**
- ナビゲーションリンク
- その他フッターコンテンツ

## レイアウト構造

### ヘッダーセクション
- 家族アイコン（RenderIcon使用）
- 家族名（オンライン名優先、なければローカル名）
- 表示ID（`@displayId`形式）

### 統計セクション
- 4つの統計情報を横並び表示
- フォロワー数、フォロー数、公開クエスト数、いいね数

### アクションセクション
- 自家族の場合: フォローボタン非表示
- 他家族の場合: フォロー/フォロー解除ボタン表示

### タイムラインセクション
- タイムラインメッセージと時刻を縦並び表示
- スクロール可能なリスト

## データフローパターン

### 家族詳細取得フロー
```typescript
useFamilyDetail({ familyId: id })
→ GET /api/families/[id]/profile
→ familyDetail, isFamilyLoading
```

### フォロー状態取得フロー
```typescript
useFollowStatus({ familyId: id })
→ GET /api/families/[id]/follow/status
→ isFollowing, isFollowLoading
```

### フォロー切り替えフロー
```typescript
useFollowToggle({ familyId: id })
→ follow() または unfollow()
→ POST /api/families/[id]/follow または DELETE /api/families/[id]/follow
```

### タイムライン取得フロー
```typescript
useFamilyTimeline({ familyId: id })
→ GET /api/families/[id]/timeline
→ timelines, isTimelineLoading
```

## レスポンシブ対応

### モバイル
- スタック表示（縦並び）
- アイコンサイズ: 小さめ

### デスクトップ
- グリッド表示（横並び）
- アイコンサイズ: 通常サイズ
