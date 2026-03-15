# 子供クエスト一覧 - コンポーネント構造

**2026年3月記載**

## 概要

子供クエスト一覧画面は、子供ユーザーが受注したクエストの一覧を表示し、進行状況を管理する画面です。

## レイアウト構造

### メインスクリーン
```
ChildQuestsScreen
  ├─ PageHeader（タイトル）
  └─ ChildQuestList
       ├─ ChildQuestFilter（検索条件）
       ├─ ChildQuestFilterPopup（フィルターモーダル）
       ├─ ChildQuestSortPopup（ソートモーダル）
       └─ ChildQuestCardLayout（クエストカード）
```

### ファイル構成
- `app/(app)/quests/child/page.tsx`: ルートページ（リダイレクト専用）
- `app/(app)/quests/child/ChildQuestsScreen.tsx`: メイン画面
- `app/(app)/quests/child/_components/ChildQuestList.tsx`: クエストリスト
- `app/(app)/quests/child/_components/ChildQuestCardLayout.tsx`: クエストカード
- `app/(app)/quests/child/_components/ChildQuestFilter.tsx`: フィルター
- `app/(app)/quests/child/_components/ChildQuestFilterPopup.tsx`: フィルターポップアップ
- `app/(app)/quests/child/_components/ChildQuestSortPopup.tsx`: ソートポップアップ
- `app/(app)/quests/child/_hooks/useChildQuests.ts`: データ取得フック

## コンポーネント詳細

### ChildQuestsScreen
**責務:** 子供クエスト一覧のトップレベルコンポーネント

**主要機能:**
- ページヘッダー表示
- ChildQuestList コンポーネントの配置

### ChildQuestList
**責務:** クエストのフィルタリング、ソート、一覧表示

**主要機能:**
- フィルター管理（クエスト名、タグ）
- ソート管理（列、昇順/降順）
- ページネーション
- クエストカードのレンダリング

**Props:**
```typescript
// Props なし（内部で状態管理）
```

**状態管理:**
```typescript
const [questFilter, setQuestFilter] = useState<ChildQuestFilterType>({ tags: [] })
const [searchFilter, setSearchFilter] = useState<ChildQuestFilterType>({ tags: [] })
const [sort, setSort] = useState<QuestSort>({ column: "id", order: "asc" })
const [page, setPage] = useState<number>(1)
```

### ChildQuestCardLayout
**責務:** クエスト情報を表示するカードコンポーネント

**表示項目:**
- クエスト名
- カテゴリバッジ
- タグ一覧
- ステータスバッジ（not_started, in_progress, pending_review, completed）
- 報酬額
- 期限

**主要Props:**
```typescript
type ChildQuestCardLayoutProps = {
  childQuest: ChildQuest
  onClick?: (id: string) => void
}
```

### ChildQuestFilter
**責務:** 検索条件の入力フォーム

**フィルター項目:**
- クエスト名（テキスト入力）
- タグ（複数選択可能）

**主要Props:**
```typescript
type ChildQuestFilterProps = {
  filter: ChildQuestFilterType
  setFilter: Dispatch<SetStateAction<ChildQuestFilterType>>
  handleSearch: () => void
}
```

### ChildQuestFilterPopup
**責務:** フィルター詳細設定用のモーダル

**表示条件:**
- モバイル表示時

### ChildQuestSortPopup
**責務:** ソート設定用のモーダル

**ソート列:**
- ID
- クエスト名
- カテゴリ
- 報酬額
- 期限

**ソート順:**
- 昇順
- 降順

## リストレイアウト

### QuestListLayout（共通レイアウト）
```typescript
<QuestListLayout
  quests={fetchedQuests}
  renderQuestCard={renderChildQuestCard}
  totalRecords={totalRecords}
  page={page}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  isLoading={isLoading}
  filterComponent={<ChildQuestFilter ... />}
  sortComponent={<ChildQuestSortPopup ... />}
/>
```

### グリッドレイアウト
- レスポンシブグリッド
- カード形式でクエスト情報を表示
- クリックで詳細画面へ遷移

## フィルター機能

### テキスト検索
- クエスト名での部分一致検索

### タグフィルター
- 複数タグの選択可能
- タグの追加・削除
- Enter キーまたは blur で確定

### 検索実行
- 「検索」ボタンクリックで実行
- URLクエリパラメータに反映

## ソート機能

### ソート可能な列
- ID
- クエスト名
- カテゴリ
- 報酬額
- 期限

### ソート順
- 昇順（asc）
- 降順（desc）

## ページネーション

### 仕様
- ページサイズ: 30件/ページ
- ページネーションコントロール表示
- 総件数表示
- 最大ページ数計算
