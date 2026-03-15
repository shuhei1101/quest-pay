(2026年3月15日 14:30記載)

# テンプレートクエスト一覧 コンポーネント構造

## ファイル構成

```
packages/web/app/(app)/quests/template/
├── page.tsx                        # ルートページ
├── TemplateQuestsScreen.tsx        # 画面メイン
└── _components/
    ├── TemplateQuestList.tsx       # 一覧コンポーネント
    └── TemplateQuestCard.tsx       # クエストカード
```

## コンポーネント階層

```
TemplateQuestsScreen
├── タイトル＆ヘッダー
├── カテゴリタブ
└── TemplateQuestList
    └── TemplateQuestCard (複数)
        ├── クエスト画像
        ├── タイトル
        ├── 説明文
        ├── カテゴリバッジ
        ├── 難易度表示
        ├── 推奨年齢
        └── 採用ボタン
```

## 主要コンポーネント詳細

### TemplateQuestsScreen
**ファイル**: `TemplateQuestsScreen.tsx`

**責務**:
- 全体レイアウト管理
- カテゴリフィルタ管理
- 採用処理の実行

**State**:
- `selectedCategoryId`: カテゴリフィルタ
- `adoptingQuestId`: 採用処理中のクエストID

### TemplateQuestList
**ファイル**: `_components/TemplateQuestList.tsx`

**Props**:
```typescript
type TemplateQuestListProps = {
  quests: TemplateQuest[]
  loading: boolean
  onAdopt: (questId: string) => void
}
```

**責務**:
- テンプレートリストの描画
- グリッドレイアウト管理
- 空状態の表示

### TemplateQuestCard
**ファイル**: `_components/TemplateQuestCard.tsx`

**Props**:
```typescript
type TemplateQuestCardProps = {
  quest: TemplateQuest
  onAdopt: (questId: string) => void
  isAdopting?: boolean
}
```

**責務**:
- テンプレートカードの描画
- 採用ボタンの制御
- クリックで詳細モーダル表示

## レイアウトパターン

### カードグリッドレイアウト
```
┌──────────┬──────────┬──────────┐
│ [画像]   │ [画像]   │ [画像]   │
│ タイトル │ タイトル │ タイトル │
│ 説明...  │ 説明...  │ 説明...  │
│ 難易度★★ │ 難易度★★★│ 難易度★  │
│ [採用]   │ [採用]   │ [採用]   │
└──────────┴──────────┴──────────┘
```

### モバイルレイアウト
```
┌─────────────────────────────────┐
│ [画像]                          │
│ タイトル                        │
│ 説明...                         │
│ 難易度★★ | 推奨年齢: 6-10歳    │
│           [採用する]            │
└─────────────────────────────────┘
```

### 空状態
```
┌─────────────────────────────────────┐
│                                     │
│        [アイコン]                   │
│  このカテゴリには                   │
│  テンプレートがありません           │
│                                     │
└─────────────────────────────────────┘
```

## 使用コンポーネント

### Mantine UI
- `Tabs`: カテゴリタブ
- `Grid`: グリッドレイアウト
- `Card`: クエストカード
- `Image`: クエスト画像
- `Text`: テキスト表示
- `Badge`: カテゴリバッジ、難易度バッジ
- `Group`: 水平配置
- `Stack`: 垂直配置
- `Button`: 採用ボタン
- `Rating`: 難易度表示
- `Modal`: 詳細モーダル

### カスタムコンポーネント
- `QuestListLayout`: クエスト一覧共通レイアウト

## スタイリング

### カード
- 角丸: `theme.radius.md`
- 影: `theme.shadows.sm`
- ホバー時: `transform: translateY(-2px)`, `shadow: lg`

### 採用ボタン
- 色: `theme.colors.blue[6]`
- 採用済み: `theme.colors.gray[6]`, disabled

### 難易度バッジ
- ★: 簡単（緑）
- ★★: 普通（黄色）
- ★★★: 難しい（赤）

### カテゴリバッジ
- サイズ: `sm`
- カテゴリごとの色分け
