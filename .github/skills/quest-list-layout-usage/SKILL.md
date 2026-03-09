---
name: quest-list-layout-usage
description: クエスト一覧レイアウト使用方法を提供するスキル。Props定義、使用例を含む。
---

# クエスト一覧レイアウト使用方法 スキル

## 概要

クエスト一覧レイアウトの使用方法を説明するスキル。

## Props定義

### 必須Props

- `quests: T[]`: 表示するクエスト一覧
- `page: number`: 現在のページ
- `maxPage: number`: 最大ページ
- `totalRecords: number`: 総レコード数
- `isLoading: boolean`: ローディング状態
- `onPageChange: (page: number) => void`: ページ変更時のハンドル
- `onSearchTextChange: (searchText: string) => void`: 検索テキスト変更時のハンドル
- `onSearch: () => void`: 検索実行時のハンドル
- `renderQuestCard: (quest: T, index: number) => ReactNode`: クエストカード描画関数
- `questCategories: QuestCategorySelect[]`: クエストカテゴリ一覧
- `filterPopup: ReactNode`: フィルターポップアップコンポーネント
- `sortPopup: ReactNode`: ソートポップアップコンポーネント
- `onFilterOpen: () => void`: フィルターポップアップ開くハンドル
- `onSortOpen: () => void`: ソートポップアップ開くハンドル
- `onCategoryChange: (categoryId: string | undefined) => void`: カテゴリ変更時のハンドル

### オプションProps

- `questCategoryById?: QuestCategoryById`: クエストカテゴリ辞書
- `filterCount?: number`: フィルター適用数（デフォルト: 0）
- `sortCount?: number`: ソート適用数（デフォルト: 0）
- `searchText?: string`: 検索テキスト（デフォルト: ""）

## 使用例

```typescript
const FamilyQuestListComponent = () => {
  const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({ tags: [] })
  const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({ tags: [] })
  const [sort, setSort] = useState<QuestSort>({ column: "id", order: "asc" })

  /** フィルター適用数を計算する */
  const filterCount = useMemo(() => {
    let count = 0
    if (searchFilter.name && searchFilter.name.trim() !== '') count++
    if (searchFilter.tags && searchFilter.tags.length > 0) count += searchFilter.tags.length
    if (searchFilter.categoryId) count++
    return count
  }, [searchFilter])

  /** ソート適用数を計算する（デフォルトはid, asc） */
  const sortCount = useMemo(() => {
    return (sort.column !== 'id' || sort.order !== 'asc') ? 1 : 0
  }, [sort])

  return (
    <QuestListLayout<FamilyQuest, FamilyQuestFilterType, QuestSort>
      quests={fetchedQuests}
      page={page}
      maxPage={maxPage}
      totalRecords={totalRecords}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onSearchTextChange={handleSearchTextChange}
      onSearch={handleSearch}
      renderQuestCard={renderFamilyQuestCard}
      questCategories={questCategories}
      questCategoryById={questCategoryById}
      onFilterOpen={openFilter}
      onSortOpen={openSort}
      onCategoryChange={handleCategoryChange}
      filterPopup={filterPopup}
      sortPopup={sortPopup}
      filterCount={filterCount}
      sortCount={sortCount}
      searchText={questFilter.name ?? ""}
    />
  )
}
```

## 機能説明

### 検索テキストとフィルターの連動

検索バーで入力したクエスト名とフィルターポップアップのクエスト名は完全に連動しています。

- 検索バーで入力 → リアルタイムで`questFilter.name`が更新される
- フィルターポップアップを開く → 検索バーの入力値が反映される
- フィルターポップアップで変更 → 検索バーの表示も自動的に更新される

**実装方法:**
1. `searchText`propで検索バーの値を制御
2. `onSearchTextChange`でリアルタイムに親コンポーネントに変更を通知
3. `QuestSearchBar`は制御コンポーネントとして実装（`value`propを優先、未指定時は内部状態を使用）

### バッジ表示機能

フィルターやソートが適用されている場合、検索バーのフィルターボタンとソートボタンにバッジが表示されます。

- `filterCount`: フィルターの適用数（検索テキスト、タグ、カテゴリの合計）
- `sortCount`: ソートの適用数（デフォルト以外のソートが適用されている場合は1）

バッジは`Indicator`コンポーネントを使用して表示され、カウントが0の場合は非表示になります。

### 無限スクロール

ページ最下層に到達すると、自動的に次のページを取得します。

### カテゴリタブ

クエストカテゴリごとにタブ表示され、タブ切り替えで絞り込みが可能です。

## 注意点

- データ表示のみ、API呼び出しは呼び出し側で実施
- レスポンシブデザイン対応済み
- フィルター・ソートのカウント計算は呼び出し側で実装すること
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
