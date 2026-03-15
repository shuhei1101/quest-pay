(2026年3月記載)

# 公開クエスト一覧 コンポーネント構造

## ファイル構成

```
packages/web/app/(app)/quests/public/
├── page.tsx                        # ルートページ
├── PublicQuestsScreen.tsx          # 画面メイン
└── _components/
    ├── PublicQuestList.tsx         # 一覧コンポーネント
    ├── PublicQuestCard.tsx         # クエストカード
    └── PublicQuestFilter.tsx       # フィルタコンポーネント
```

## コンポーネント階層

```
PublicQuestsScreen
├── タイトル＆ヘッダー
├── 検索バー
├── PublicQuestFilter
│   ├── カテゴリフィルタ
│   ├── ソート選択
│   └── 適用ボタン
└── PublicQuestList
    └── PublicQuestCard (複数)
        ├── クエスト画像
        ├── タイトル
        ├── 説明文
        ├── カテゴリバッジ
        ├── いいね数・コメント数
        ├── 作成者情報
        └── アクションボタン
```

## 主要コンポーネント詳細

### PublicQuestsScreen
**ファイル**: `PublicQuestsScreen.tsx`

**責務**:
- 全体レイアウト管理
- 検索・フィルタ状態管理
- ページネーション制御

**State**:
- `searchQuery`: 検索キーワード
- `categoryId`: カテゴリフィルタ
- `sortBy`: ソート基準
- `page`: 現在のページ

### PublicQuestList
**ファイル**: `_components/PublicQuestList.tsx`

**Props**:
```typescript
type PublicQuestListProps = {
  quests: PublicQuest[]
  loading: boolean
  onLoadMore?: () => void
}
```

**責務**:
- クエストリストの描画
- グリッドレイアウト管理
- 空状態の表示
- 無限スクロール対応

### PublicQuestCard
**ファイル**: `_components/PublicQuestCard.tsx`

**Props**:
```typescript
type PublicQuestCardProps = {
  quest: PublicQuest
  onLike: (questId: string) => void
  onComment: (questId: string) => void
}
```

**責務**:
- 公開クエストカードの描画
- いいね・コメントボタン
- クリックで詳細画面へ遷移

### PublicQuestFilter
**ファイル**: `_components/PublicQuestFilter.tsx`

**Props**:
```typescript
type PublicQuestFilterProps = {
  categories: QuestCategory[]
  selectedCategoryId?: number
  sortBy: SortOption
  onCategoryChange: (categoryId?: number) => void
  onSortChange: (sortBy: SortOption) => void
}
```

**責務**:
- フィルタUI表示
- カテゴリ選択
- ソート選択

## レイアウトパターン

### カードグリッドレイアウト
```
┌──────────┬──────────┬──────────┐
│ [画像]   │ [画像]   │ [画像]   │
│ タイトル │ タイトル │ タイトル │
│ 説明...  │ 説明...  │ 説明...  │
│ ♥12 💬5  │ ♥20 💬8  │ ♥8 💬3   │
└──────────┴──────────┴──────────┘
```

### モバイルレイアウト
```
┌─────────────────────────────────┐
│ [画像]                          │
│ タイトル                        │
│ 説明...                         │
│ ♥12 💬5                         │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ [画像]                          │
│ タイトル                        │
│ 説明...                         │
│ ♥20 💬8                         │
└─────────────────────────────────┘
```

### 空状態
```
┌─────────────────────────────────────┐
│                                     │
│        [アイコン]                   │
│     公開クエストがありません        │
│                                     │
└─────────────────────────────────────┘
```

## 使用コンポーネント

### Mantine UI
- `Grid`: グリッドレイアウト
- `Card`: クエストカード
- `Image`: クエスト画像
- `Text`: テキスト表示
- `Badge`: カテゴリバッジ
- `Group`: 水平配置
- `Stack`: 垂直配置
- `ActionIcon`: いいね・コメントボタン
- `TextInput`: 検索入力
- `Select`: カテゴリ選択
- `Menu`: ソートメニュー

### カスタムコンポーネント
- `QuestListLayout`: クエスト一覧共通レイアウト

## スタイリング

### カード
- 角丸: `theme.radius.md`
- 影: `theme.shadows.sm`
- ホバー時: `transform: translateY(-2px)`

### いいね済み
- アイコン色: `theme.colors.red[6]`
- アクティブ状態: filled

### カテゴリバッジ
- サイズ: `sm`
- カテゴリごとの色分け
