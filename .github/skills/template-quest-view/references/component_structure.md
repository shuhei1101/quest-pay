# テンプレートクエスト閲覧画面 コンポーネント構造

**最終更新: 2026年3月記載**

## ファイル構成

```
app/(app)/quests/template/[id]/
  ├── page.tsx                              # ページエントリーポイント
  ├── TemplateQuestViewScreen.tsx           # メイン画面コンポーネント
  └── _components/
      ├── TemplateQuestDetail.tsx           # テンプレート詳細表示
      └── AdoptButton.tsx                   # 採用ボタン
```

### 関連フック
```
app/(app)/quests/template/_hooks/
  └── useTemplateQuest.ts                   # テンプレートクエストデータ取得
```

---

## コンポーネント階層

```
TemplateQuestViewScreen
  ├── TemplateQuestDetail
  │   ├── QuestViewHeader（共通）
  │   ├── Tabs
  │   │   ├── QuestConditionTab（共通）
  │   │   ├── QuestDetailTab（共通）
  │   │   └── QuestOtherTab（共通）
  └── AdoptButton
```

---

## 各コンポーネント詳細

### 1. TemplateQuestViewScreen

**パス:** `app/(app)/quests/template/[id]/TemplateQuestViewScreen.tsx`

**役割:** テンプレートクエスト閲覧のメイン画面

**主要機能:**
- テンプレート詳細情報表示
- 家族クエストとして採用
- プレビュー機能

**使用フック:**
- `useTemplateQuest(questId)`: テンプレートデータ取得

**状態管理:**
```typescript
{
  templateQuest: TemplateQuest | null       // テンプレートクエストデータ
  isLoading: boolean                        // ローディング状態
  error: Error | null                       // エラー状態
}
```

**Props:**
```typescript
{
  questId: string    // テンプレートクエストID
}
```

---

### 2. TemplateQuestDetail

**パス:** `app/(app)/quests/template/_components/TemplateQuestDetail.tsx`

**役割:** テンプレートクエストの詳細情報を表示

**Props:**
```typescript
{
  quest: {
    id: string
    name: string
    backgroundColor?: { light: string, dark: string }
    level: number
    category: string
    successCondition: string
    reward: number
    exp: number
    requiredCompletionCount: number
    client: string
    requestDetail: string
    tags: string[]
    ageFrom?: number | null
    ageTo?: number | null
    monthFrom?: number | null
    monthTo?: number | null
    iconName?: string
    iconSize?: number
    iconColor?: string
  }
}
```

**構成:**
- QuestViewHeader: ヘッダー表示
- Tabs: タブナビゲーション
  - QuestConditionTab: 条件タブ
  - QuestDetailTab: 依頼情報タブ
  - QuestOtherTab: その他タブ

---

### 3. AdoptButton

**パス:** `app/(app)/quests/template/_components/AdoptButton.tsx`

**役割:** テンプレートクエストを家族クエストとして採用

**主要機能:**
- 採用確認モーダル表示
- テンプレートデータを基に家族クエスト作成
- 家族クエスト編集画面へリダイレクト

**Props:**
```typescript
{
  templateQuestId: string     // テンプレートクエストID
  onAdoptSuccess?: () => void // 採用成功時のコールバック
}
```

**内部処理:**
```typescript
const handleAdopt = async () => {
  // 1. 確認モーダル表示
  const confirmed = await openConfirmModal()
  if (!confirmed) return

  // 2. テンプレートデータを基に家族クエスト作成
  const newQuestId = await createFamilyQuestFromTemplate(templateQuestId)

  // 3. 家族クエスト編集画面へリダイレクト
  navigate(`/quests/family/${newQuestId}/edit`)
}
```

---

## 共通コンポーネント使用

テンプレートクエスト閲覧画面では、以下の共通コンポーネントを使用します:

### QuestViewHeader
**パス:** `app/(app)/quests/view/_components/QuestViewHeader.tsx`

クエスト名を表示するヘッダー

### QuestConditionTab
**パス:** `app/(app)/quests/view/_components/QuestConditionTab.tsx`

クエスト条件（レベル、カテゴリ、達成条件、報酬、経験値、必要完了回数）を表示

### QuestDetailTab
**パス:** `app/(app)/quests/view/_components/QuestDetailTab.tsx`

依頼情報（依頼主、依頼内容）を表示

### QuestOtherTab
**パス:** `app/(app)/quests/view/_components/QuestOtherTab.tsx`

その他情報（タグ、推奨年齢・月齢）を表示

---

## データフロー

```
useTemplateQuest
  ↓ APIコール
GET /api/quests/template/{id}
  ↓ データ取得
TemplateQuestViewScreen
  ↓ Props渡し
TemplateQuestDetail
  ↓ Props渡し
共通コンポーネント（QuestViewHeader, Tabs, etc.）
```

---

## スタイリング

### レイアウト
- **モバイル**: 縦スクロール、タブは横スクロール可能
- **タブレット以上**: 全タブ表示、広めの余白

### カラーリング
- ヘッダー背景: templateQuestのbackgroundColor
- タブ: Mantineのデフォルトテーマ
- 採用ボタン: プライマリカラー（青系）

---

## アクセシビリティ

- **キーボードナビゲーション**: タブ切り替え、ボタン操作
- **スクリーンリーダー**: 各セクションにaria-label付与
- **フォーカス管理**: モーダル開閉時のフォーカス制御

---

## テンプレートクエスト固有の特徴

### 編集不可
- テンプレートクエストは読み取り専用
- 編集ボタンは表示されない

### 採用機能
- 「採用」ボタンで家族クエストとしてコピー
- 採用後は家族クエスト編集画面へ遷移

### プレビュー
- すべてのユーザーが閲覧可能
- 権限チェック不要
