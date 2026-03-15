# 公開クエスト閲覧画面 - コンポーネント構造

**(2026年3月15日 14:30記載)**

## ファイル構成

### メイン画面コンポーネント
```
app/(app)/quests/public/[id]/view/
├── page.tsx                          # ルートページ（リダイレクト）
├── PublicQuestView.tsx               # 閲覧画面メイン（ビジネスロジック + FAB制御）
└── _components/
    └── PublicQuestViewLayout.tsx     # レイアウト（プレゼンテーション）
```

### コメント関連ファイル
```
app/(app)/quests/public/[id]/comments/
├── PublicQuestComments.tsx           # コメントモーダルメイン（ビジネスロジック）
└── _components/
    ├── CommentsModalLayout.tsx       # モーダルレイアウト
    ├── CommentsLayout.tsx            # コメント一覧 + 入力欄
    └── CommentItemLayout.tsx         # 個別コメントアイテム
```

### フック
```
app/(app)/quests/public/[id]/view/_hooks/
├── usePublicQuest.ts                 # クエスト詳細取得
├── useLikeQuest.ts                   # いいね
├── useCancelQuestLike.ts             # いいね解除
├── useLikeCount.ts                   # いいね数取得
└── useIsLike.ts                      # いいね状態確認

app/(app)/quests/public/[id]/comments/_hooks/
├── useCommentsCount.ts               # コメント数取得
├── usePublicQuestComments.ts         # コメント一覧取得
├── usePostComment.ts                 # コメント投稿
├── useUpvoteComment.ts               # 高評価
├── useDownvoteComment.ts             # 低評価
├── useReportComment.ts               # コメント報告
├── useDeleteComment.ts               # コメント削除
├── usePinComment.ts                  # ピン留め
└── usePublisherLike.ts               # 公開者いいね
```

## コンポーネント階層

```
PublicQuestView (Container)
├── PublicQuestViewLayout (Presentation)
│   ├── Header (タイトル + アイコン)
│   ├── Tabs (クエスト条件/依頼情報/その他)
│   │   ├── Tab 1: クエスト条件
│   │   │   ├── レベル表示
│   │   │   ├── 成功条件
│   │   │   ├── 報酬・経験値
│   │   │   └── 対象年齢
│   │   ├── Tab 2: 依頼情報
│   │   │   ├── クライアント
│   │   │   └── 詳細説明
│   │   └── Tab 3: その他
│   │       ├── タグ一覧
│   │       └── 推奨年齢
│   └── Loading Overlay
├── SubMenuFAB (FAB制御)
│   ├── いいねボタン（バッジ付きいいね数）
│   ├── コメントボタン（バッジ付きコメント数）
│   ├── 家族ボタン
│   └── レベル選択ボタン（複数レベルがある場合）
├── Level Selection Menu (ポップアップ)
│   └── レベル選択リスト
└── PublicQuestComments (モーダル)
    └── CommentsModalLayout
        ├── ヘッダー（閉じるボタン）
        ├── ソート切り替え（newest/likes）
        ├── CommentsLayout
        │   ├── コメント一覧
        │   │   └── CommentItemLayout (繰り返し)
        │   │       ├── ユーザー情報
        │   │       ├── コメント本文
        │   │       ├── 高評価/低評価ボタン
        │   │       ├── 報告ボタン
        │   │       ├── 削除ボタン（自コメント）
        │   │       ├── ピン留めボタン（公開者のみ）
        │   │       └── 公開者いいねバッジ
        │   └── コメント入力欄
        └── フッター
```

## 主要コンポーネント詳細

### PublicQuestView
**責務:** ビジネスロジック、状態管理、FAB制御、モーダル制御

**State:**
- `selectedLevel`: 選択中のレベル
- `levelMenuOpened`: レベル選択メニューの開閉状態
- `commentModalOpened`: コメントモーダルの開閉状態

**主要機能:**
- クエストデータの取得（usePublicQuest）
- いいね操作（useLikeQuest, useCancelQuestLike）
- いいね数・状態の取得（useLikeCount, useIsLike）
- コメント数の取得（useCommentsCount）
- レベル選択の管理
- FABメニューの制御（SubMenuFAB）
- コメントモーダルの開閉制御

**Props:**
```typescript
{
  id: string  // 公開クエストID
}
```

### PublicQuestViewLayout
**責務:** プレゼンテーション、タブ切り替え

**Props:**
```typescript
{
  questName: string
  headerColor?: { light: string, dark: string }
  backgroundColor: { light: string, dark: string }
  iconName?: string
  iconSize?: number
  iconColor?: string
  isLoading: boolean
  level: number
  category: string
  successCondition: string
  reward: number
  exp: number
  requiredCompletionCount: number
  client: string
  requestDetail: string
  tags: string[]
  ageFrom?: number
  ageTo?: number
  monthFrom?: number
  monthTo?: number
  requiredClearCount: number | null
  availableLevels: number[]
  onLevelChange: (level: number) => void
}
```

### PublicQuestComments
**責務:** コメントモーダルのビジネスロジック

**State:**
- `comment`: コメント入力内容
- `sortType`: ソート方法（newest/likes）

**主要機能:**
- コメント一覧の取得
- コメント投稿
- 高評価・低評価
- コメント報告
- コメント削除（自コメントのみ）
- ピン留め/解除（公開者のみ）
- 公開者いいね（公開者のみ）

**Props:**
```typescript
{
  id: string           // 公開クエストID
  opened: boolean      // モーダル開閉状態
  onClose: () => void  // モーダル閉じる関数
}
```

### CommentsModalLayout
**責務:** コメントモーダルのレイアウト

**Props:**
```typescript
{
  children: React.ReactNode
  opened: boolean
  onClose: () => void
  sortType: "newest" | "likes"
  onSortChange: (sort: "newest" | "likes") => void
}
```

### CommentItemLayout
**責務:** 個別コメントの表示

**Props:**
```typescript
{
  commentId: string
  userName: string
  userIcon?: string
  content: string
  createdAt: string
  likeCount: number
  isUpvoted: boolean
  isDownvoted: boolean
  isPinned: boolean
  hasPublisherLike: boolean
  isOwnComment: boolean
  isPublisher: boolean
  onUpvote: () => void
  onDownvote: () => void
  onReport: () => void
  onDelete: () => void
  onPin: () => void
  onPublisherLike: () => void
}
```

## レイアウト構造

### タブ構造
- **クエスト条件タブ:** レベル、成功条件、報酬・経験値、必須完了回数
- **依頼情報タブ:** クライアント、詳細説明
- **その他タブ:** タグ、対象年齢

### FABボタン配置
- 画面右下に固定配置
- メインFAB + サブメニュー（展開式）
- いいね・コメントボタンにはIndicator（バッジ）表示
- レベル選択メニューは独立したポップアップ

### コメントモーダル
- 全画面モーダル
- ヘッダー固定（閉じるボタン + ソート切り替え）
- コメント一覧（スクロール可能）
- コメント入力欄固定（下部）

## レスポンシブ対応
- モバイル: FAB位置 right: 20px
- デスクトップ: FAB位置 right: 40px
- レベル選択メニュー: FABの上部（bottom: 90px）
