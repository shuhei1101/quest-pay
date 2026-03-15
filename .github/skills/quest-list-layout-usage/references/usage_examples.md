# クエストリストレイアウト - 使用例

**最終更新:** 2026年3月記載

## 基本的な使用例

### 家族クエストリスト

**ファイル:** `app/(app)/quests/family/_components/FamilyQuestList.tsx`

```typescript
const FamilyQuestListComponent = () => {
  const router = useRouter()
  
  // フィルター・ソート状態
  const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({ tags: [] })
  const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({ tags: [] })
  const [sort, setSort] = useState<QuestSort>({ column: "id", order: "asc" })
  
  // ポップアップ制御
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
  const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)
  
  // データ取得
  const { fetchedQuests, isLoading, totalRecords, maxPage } = useFamilyQuests({
    filter: searchFilter,
    sortColumn: sort.column,
    sortOrder: sort.order,
    page,
    pageSize: 30
  })
  
  // カテゴリデータ
  const { questCategories, questCategoryById } = useQuestCategories()
  
  // イベントハンドラ
  const handleSearchTextChange = useCallback((searchText: string) => {
    setQuestFilter((prev) => ({ ...prev, name: searchText }))
  }, [])
  
  const handleSearch = useCallback(() => {
    // クエリパラメータを更新してAPI再取得
    const params = new URLSearchParams(
      Object.entries(questFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
    router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
    setSearchFilter(questFilter)
  }, [questFilter, router])
  
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])
  
  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    setSearchFilter((prev) => ({ ...prev, categoryId }))
    setPage(1)
  }, [])
  
  // カード描画関数
  const renderFamilyQuestCard = useCallback((quest: FamilyQuest, index: number) => (
    <FamilyQuestCardLayout
      key={index}
      familyQuest={quest}
      onClick={(id) => router.push(FAMILY_QUEST_VIEW_URL(id))}
    />
  ), [router])
  
  // フィルター/ソート適用数計算
  const filterCount = useMemo(() => {
    let count = 0
    if (searchFilter.name && searchFilter.name.trim() !== '') count++
    if (searchFilter.tags && searchFilter.tags.length > 0) count += searchFilter.tags.length
    if (searchFilter.categoryId) count++
    return count
  }, [searchFilter])
  
  const sortCount = useMemo(() => {
    return (sort.column !== 'id' || sort.order !== 'asc') ? 1 : 0
  }, [sort])
  
  // ポップアップコンポーネント
  const filterPopup = useMemo(() => (
    <FamilyQuestFilterPopup
      close={closeFilter}
      handleSearch={handleFilterSearch}
      currentFilter={questFilter}
      opened={filterOpened}
    />
  ), [closeFilter, handleFilterSearch, questFilter, filterOpened])
  
  const sortPopup = useMemo(() => (
    <FamilyQuestSortPopup
      close={closeSort}
      handleSearch={handleSortSearch}
      opened={sortOpened}
      currentSort={sort}
    />
  ), [closeSort, handleSortSearch, sortOpened, sort])
  
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

## クエストタイプ別の実装パターン

### 公開クエストリスト

**特徴:**
- 読み取り専用（編集・削除なし）
- いいね・コメント機能
- 検索重視（タグ検索が重要）

```typescript
const PublicQuestListComponent = () => {
  const renderPublicQuestCard = useCallback((quest: PublicQuest, index: number) => (
    <PublicQuestCardLayout
      key={index}
      publicQuest={quest}
      onLike={handleLike}
      onComment={handleComment}
    />
  ), [handleLike, handleComment])
  
  const filterCount = useMemo(() => {
    let count = 0
    if (searchFilter.name && searchFilter.name.trim() !== '') count++
    if (searchFilter.tags && searchFilter.tags.length > 0) count += searchFilter.tags.length
    // 公開クエストはカテゴリフィルタがない場合もある
    return count
  }, [searchFilter])
  
  return (
    <QuestListLayout
      quests={fetchedQuests}
      // ... その他のprops
      renderQuestCard={renderPublicQuestCard}
      filterCount={filterCount}
    />
  )
}
```

### テンプレートクエストリスト

**特徴:**
- 採用機能（家族クエストとしてコピー）
- プレビュー重視

```typescript
const TemplateQuestListComponent = () => {
  const renderTemplateQuestCard = useCallback((quest: TemplateQuest, index: number) => (
    <TemplateQuestCardLayout
      key={index}
      templateQuest={quest}
      onAdopt={handleAdopt}
    />
  ), [handleAdopt])
  
  return (
    <QuestListLayout
      quests={fetchedQuests}
      // ... その他のprops
      renderQuestCard={renderTemplateQuestCard}
    />
  )
}
```

## フィルター/ソートポップアップの実装例

### フィルターポップアップ

```typescript
const FamilyQuestFilterPopup = ({ 
  close, 
  handleSearch, 
  currentFilter, 
  opened 
}: {
  close: () => void
  handleSearch: (filter: FamilyQuestFilterType) => void
  currentFilter: FamilyQuestFilterType
  opened: boolean
}) => {
  const [localFilter, setLocalFilter] = useState<FamilyQuestFilterType>(currentFilter)
  
  useEffect(() => {
    setLocalFilter(currentFilter)
  }, [currentFilter, opened])
  
  const onSubmit = () => {
    handleSearch(localFilter)
    close()
  }
  
  return (
    <Drawer opened={opened} onClose={close}>
      <TextInput
        label="クエスト名"
        value={localFilter.name ?? ""}
        onChange={(e) => setLocalFilter({ ...localFilter, name: e.currentTarget.value })}
      />
      <MultiSelect
        label="タグ"
        data={TAG_OPTIONS}
        value={localFilter.tags ?? []}
        onChange={(tags) => setLocalFilter({ ...localFilter, tags })}
      />
      <Button onClick={onSubmit}>検索</Button>
    </Drawer>
  )
}
```

### ソートポップアップ

```typescript
const FamilyQuestSortPopup = ({ 
  close, 
  handleSearch, 
  currentSort, 
  opened 
}: {
  close: () => void
  handleSearch: (sort: QuestSort) => void
  currentSort: QuestSort
  opened: boolean
}) => {
  const [localSort, setLocalSort] = useState<QuestSort>(currentSort)
  
  const onSubmit = () => {
    handleSearch(localSort)
    close()
  }
  
  return (
    <Drawer opened={opened} onClose={close}>
      <Select
        label="ソート項目"
        value={localSort.column}
        data={[
          { value: "id", label: "ID" },
          { value: "created_at", label: "作成日" },
          { value: "updated_at", label: "更新日" }
        ]}
        onChange={(value) => setLocalSort({ ...localSort, column: value as QuestSort['column'] })}
      />
      <SegmentedControl
        value={localSort.order}
        data={[
          { value: "asc", label: "昇順" },
          { value: "desc", label: "降順" }
        ]}
        onChange={(value) => setLocalSort({ ...localSort, order: value as QuestSort['order'] })}
      />
      <Button onClick={onSubmit}>適用</Button>
    </Drawer>
  )
}
```

## カスタムレンダリング例

### 複雑なカード（進捗情報付き）

```typescript
const renderQuestCardWithProgress = useCallback((quest: FamilyQuest, index: number) => (
  <Card key={index} onClick={() => router.push(FAMILY_QUEST_VIEW_URL(quest.quest.id))}>
    <Group justify="space-between">
      <Text>{quest.quest.name}</Text>
      <Badge>{quest.quest.category?.name}</Badge>
    </Group>
    <Progress value={quest.progress} />
    <Text size="sm" c="dimmed">
      {quest.completedChildren}/{quest.totalChildren} 完了
    </Text>
  </Card>
), [router])
```

### シンプルなカード

```typescript
const renderSimpleQuestCard = useCallback((quest: PublicQuest, index: number) => (
  <Paper key={index} p="md" withBorder>
    <Text fw={500}>{quest.quest.name}</Text>
    <Text size="sm" c="dimmed">{quest.quest.description}</Text>
  </Paper>
), [])
```

## クエリパラメータとの連動

### URLからフィルターを復元

```typescript
const searchParams = useSearchParams()

useEffect(() => {
  const queryObj = Object.fromEntries(searchParams.entries())
  const parsedQuery = {
    ...queryObj,
    tags: queryObj.tags ? queryObj.tags.split(",") : []
  }
  setQuestFilter(FamilyQuestFilterScheme.parse(parsedQuery))
}, [searchParams.toString()])
```

### フィルターをURLに反映

```typescript
const handleSearch = useCallback(() => {
  const paramsObj = Object.fromEntries(
    Object.entries(questFilter)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  )
  const params = new URLSearchParams(paramsObj)
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  setSearchFilter(questFilter)
}, [questFilter, router])
```

## ベストプラクティス

### 1. 検索テキストの連動
```typescript
// ✅ 良い例: 制御コンポーネントとして使用
<QuestListLayout
  searchText={questFilter.name ?? ""}
  onSearchTextChange={(text) => setQuestFilter({ ...questFilter, name: text })}
/>

// ❌ 悪い例: 連動なし
<QuestListLayout
  onSearchTextChange={(text) => console.log(text)} // フィルターに反映しない
/>
```

### 2. バッジカウントの計算
```typescript
// ✅ 良い例: useMemoで最適化
const filterCount = useMemo(() => {
  let count = 0
  if (searchFilter.name) count++
  if (searchFilter.tags?.length) count += searchFilter.tags.length
  return count
}, [searchFilter])

// ❌ 悪い例: 毎回計算
const filterCount = calculateFilterCount(searchFilter) // レンダリング毎に実行
```

### 3. ページリセット
```typescript
// ✅ 良い例: カテゴリ変更時にページをリセット
const handleCategoryChange = useCallback((categoryId: string | undefined) => {
  setSearchFilter((prev) => ({ ...prev, categoryId }))
  setPage(1) // ページをリセット
}, [])

// ❌ 悪い例: ページをリセットしない
const handleCategoryChange = useCallback((categoryId: string | undefined) => {
  setSearchFilter((prev) => ({ ...prev, categoryId }))
  // ページが2以降の場合、データが空になる
}, [])
```
