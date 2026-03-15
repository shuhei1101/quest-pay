(2026年3月記載)

# 家族クエスト一覧画面 リスト操作

## 主要操作一覧

| 操作 | トリガー | アクション | 遷移先 |
|------|---------|-----------|--------|
| クエスト選択 | カードクリック | 詳細画面表示 | `/quests/family/{id}/view` |
| 新規作成 | FABクリック | 作成画面表示 | `/quests/family/new` |
| タブ切り替え | タブクリック | 別タブ表示 | `?tab={value}` |
| カテゴリ選択 | カテゴリタブクリック | フィルタリング | - |
| フィルター | フィルターボタン | ポップアップ表示 | - |
| ソート | ソートボタン | ポップアップ表示 | - |
| 検索 | 検索バー入力 | テキスト検索 | - |
| ページ切り替え | ページ番号クリック | 別ページ表示 | - |
| プルリフレッシュ | 下スワイプ | データ再取得 | - |

---

## クエスト選択操作

### 実装詳細
```typescript
const handleQuestClick = (questId: string) => {
  router.push(FAMILY_QUEST_VIEW_URL(questId))
}
```

### 動作仕様
1. ユーザーがクエストカードをクリック
2. `onClick`イベント発火
3. `router.push()`で詳細画面へ遷移
4. 詳細画面で詳細情報を表示

### カードコンポーネント
```typescript
<FamilyQuestCardLayout
  familyQuest={quest}
  onClick={(id) => router.push(FAMILY_QUEST_VIEW_URL(id))}
/>
```

---

## タブ切り替え操作

### タブ定義
```typescript
const VALID_TABS = ['public', 'family', 'penalty', 'template'] as const
```

### タブ切り替え実装
```typescript
const handleTabChange = (value: string | null) => {
  if (!value) return
  setTabValue(value)
  
  // URLクエリパラメータを更新
  const params = new URLSearchParams(searchParams.toString())
  params.set('tab', value)
  router.replace(`?${params.toString()}`, { scroll: false })
}
```

### タブごとの表示内容

#### 公開タブ (`tab=public`)
- `<PublicQuestList>` コンポーネント表示
- 公開されたクエスト一覧
- 色: 青 (`rgb(96 165 250)`)

#### 家族タブ (`tab=family`)
- `<FamilyQuestList>` コンポーネント表示
- 家族内クエスト一覧
- 色: 緑 (`rgb(74, 222, 128)`)

#### 違反リストタブ (`tab=penalty`)
- 未実装
- 色: 赤 (`rgb(252, 132, 132)`)

#### テンプレートタブ (`tab=template`)
- `<TemplateQuestList>` コンポーネント表示
- テンプレートクエスト一覧
- 色: 黄 (`rgb(250 204 21)`)

### タブ自動スクロール
横スクロール時、選択タブを表示領域に自動スクロール:
```typescript
const { tabListRef } = useTabAutoScroll(tabValue)
```

---

## カテゴリ選択操作

### 実装詳細
```typescript
const handleCategoryChange = (categoryId: string | undefined) => {
  setSearchFilter((prev) => ({
    ...prev,
    categoryId
  }))
  setPage(1)  // ページをリセット
}
```

### カテゴリタブ表示
```typescript
<QuestListLayout
  categories={questCategories}
  onCategoryChange={handleCategoryChange}
/>
```

### 動作仕様
1. カテゴリタブをクリック
2. `searchFilter.categoryId`を更新
3. ページを1にリセット
4. `useFamilyQuests`が自動で再実行
5. フィルタリングされた結果表示

---

## フィルター操作

### フィルターボタンクリック
```typescript
const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)

<Button onClick={openFilter}>フィルター</Button>

<FamilyQuestFilterPopup
  opened={filterOpened}
  close={closeFilter}
  handleSearch={handleFilterSearch}
/>
```

### フィルター適用
```typescript
const handleFilterSearch = (filter: FamilyQuestFilterType) => {
  setQuestFilter(filter)
  
  // URLクエリパラメータを更新
  const paramsObj = Object.fromEntries(
    Object.entries(filter)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  )
  const params = new URLSearchParams({
    tab: 'family',
    ...paramsObj
  })
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  
  setSearchFilter(filter)
}
```

### フィルター項目
- **クエスト名**: 部分一致検索
- **カテゴリ**: カテゴリID指定
- **タグ**: タグ配列（複数選択可）
- **報酬範囲**: 最小報酬・最大報酬

---

## ソート操作

### ソートボタンクリック
```typescript
const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)

<Button onClick={openSort}>並び替え</Button>

<FamilyQuestSortPopup
  opened={sortOpened}
  close={closeSort}
  handleSearch={handleSortSearch}
/>
```

### ソート適用
```typescript
const handleSortSearch = (newSort: QuestSort) => {
  setSort(newSort)
  
  // URLクエリパラメータを更新
  const filterParams = Object.fromEntries(
    Object.entries(questFilter)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  )
  const params = new URLSearchParams({
    tab: 'family',
    ...filterParams,
    sortColumn: newSort.column,
    sortOrder: newSort.order
  })
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  
  setSearchFilter(questFilter)
}
```

### ソート項目
- **ID順**: `{ column: 'id', order: 'asc' | 'desc' }`
- **タイトル順**: `{ column: 'title', order: 'asc' | 'desc' }`
- **作成日順**: `{ column: 'createdAt', order: 'asc' | 'desc' }`
- **報酬額順**: `{ column: 'reward', order: 'asc' | 'desc' }`

---

## 検索操作

### 検索バー実装
```typescript
const handleSearchTextChange = (searchText: string) => {
  setQuestFilter((prev) => ({
    ...prev,
    name: searchText
  }))
}

const handleSearch = () => {
  const paramsObj = Object.fromEntries(
    Object.entries(questFilter)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  )
  const params = new URLSearchParams(paramsObj)
  
  // フィルターをURLに反映
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  
  // 検索フィルターを更新し、一覧を更新
  setSearchFilter(questFilter)
}
```

### 検索トリガー
- 検索ボタンクリック
- Enterキー押下

---

## ページネーション操作

### ページ切り替え実装
```typescript
const handlePageChange = (newPage: number) => {
  setPage(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
```

### ページネーションコンポーネント
```typescript
<Pagination 
  page={page}
  total={maxPage}
  onChange={handlePageChange}
  color="blue"
/>
```

### 動作仕様
1. ユーザーがページ番号をクリック
2. `page`状態更新
3. ページトップへスムーススクロール
4. `useFamilyQuests`が自動で再実行
5. オフセット計算: `offset = (page - 1) * pageSize`
6. 新しいページのデータ取得・表示

---

## プルリフレッシュ操作

### 実装（モバイルのみ）
```typescript
const { refetch } = useFamilyQuests({...})

<RefreshControl
  refreshing={isRefreshing}
  onRefresh={async () => {
    await refetch()
  }}
/>
```

### 動作仕様
1. 画面を下にスワイプ
2. スピナー表示
3. `refetch()`実行
4. API再呼び出し
5. 一覧更新
6. スピナー非表示

---

## 新規作成操作

### FloatingActionButton設定
```typescript
<SubMenuFAB
  items={[
    {
      icon: <IconPlus size={20} />,
      label: "追加",
      onClick: () => router.push(FAMILY_QUEST_NEW_URL),
    },
  ]}
/>
```

### 動作フロー
1. FABクリック
2. `/quests/family/new`へ遷移
3. 新規作成フォーム表示
4. 作成完了後:
   - キャッシュ無効化: `invalidateQueries(['familyQuests'])`
   - 一覧へ戻る
   - 自動でデータ再取得・更新

---

## ナビゲーション詳細

### ルーティング構造
```
/quests/family                      # 一覧画面（家族タブ）
├── ?tab=public                     # 公開タブ
├── ?tab=family                     # 家族タブ
├── ?tab=penalty                    # 違反リストタブ
├── ?tab=template                   # テンプレートタブ
├── /new                            # 新規作成
└── /:id/view                       # 詳細画面
```

### 遷移パターン

#### 一覧 → 詳細
```typescript
router.push(`/quests/family/${questId}/view`)
```

#### 一覧 → 新規作成
```typescript
router.push('/quests/family/new')
```

#### 戻るナビゲーション
```typescript
router.back()  // ブラウザ履歴の前ページへ
```

---

## URL クエリパラメータ管理

### クエリパラメータ構造
```
/quests/family?tab=family&name=掃除&categoryId=1&sortColumn=createdAt&sortOrder=desc&page=2
```

### パラメータ一覧
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| tab | string | タブ値（public/family/penalty/template） |
| name | string | 検索テキスト |
| categoryId | string | カテゴリID |
| tags | string | タグ（カンマ区切り） |
| minReward | number | 最小報酬 |
| maxReward | number | 最大報酬 |
| sortColumn | string | ソート列 |
| sortOrder | string | ソート順（asc/desc） |
| page | number | ページ番号（将来実装） |

### クエリパラメータ → フィルター変換
```typescript
useEffect(() => {
  const queryObj = Object.fromEntries(searchParams.entries())
  const parsedQuery = {
    ...queryObj,
    tags: queryObj.tags ? queryObj.tags.split(",") : []
  }
  setQuestFilter(FamilyQuestFilterScheme.parse(parsedQuery))
}, [searchParams])
```

---

## UI状態管理

### ローディング状態
```typescript
{isLoading && !fetchedQuests.length && (
  <Center><Loader size="lg" /></Center>
)}

{isLoading && fetchedQuests.length > 0 && (
  <Loader size="sm" />  // ページ遷移時
)}
```

### エラー状態
```typescript
{error && (
  <Alert color="red">
    クエスト一覧の取得に失敗しました
    <Button onClick={refetch}>リトライ</Button>
  </Alert>
)}
```

### 空状態
```typescript
{!isLoading && fetchedQuests.length === 0 && (
  <Center>
    <Stack align="center">
      <IconClipboardOff size={48} />
      <Text>クエストがありません</Text>
      <Button onClick={() => router.push('/quests/family/new')}>
        クエストを作成
      </Button>
    </Stack>
  </Center>
)}
```

---

## キーボード操作（アクセシビリティ）

### サポート予定キー
- `Enter`: 選択中のクエストを開く
- `↓/↑`: カード間移動
- `Tab`: フォーカス移動
- `Cmd/Ctrl + F`: 検索バーにフォーカス
- `Esc`: ポップアップを閉じる

### 実装方針
```typescript
<FamilyQuestCardLayout
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleQuestClick(quest.id)
  }}
/>
```

---

## パフォーマンス最適化

### メモ化
```typescript
const MemoizedQuestCard = memo(FamilyQuestCardLayout)

const renderFamilyQuestCard = useCallback((quest: FamilyQuest, index: number) => (
  <MemoizedQuestCard
    key={index}
    familyQuest={quest}
    onClick={handleQuestClick}
  />
), [handleQuestClick])
```

### 仮想化（将来実装）
大量データ対応:
```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={fetchedQuests.length}
  itemSize={120}
>
  {({ index, style }) => (
    <div style={style}>
      <FamilyQuestCardLayout quest={fetchedQuests[index]} />
    </div>
  )}
</FixedSizeList>
```

### プリフェッチ
詳細画面へのプリフェッチ（ホバー時）:
```typescript
const prefetchQuestDetail = (questId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['familyQuest', questId],
    queryFn: () => fetchFamilyQuestDetail(questId)
  })
}

<FamilyQuestCardLayout
  onMouseEnter={() => prefetchQuestDetail(quest.id)}
/>
```

---

## フィルター/ソートのリセット

### フィルタークリア
```typescript
const handleClearFilter = () => {
  setQuestFilter({ tags: [] })
  setSearchFilter({ tags: [] })
  router.push(`${FAMILY_QUESTS_URL}?tab=family`)
}
```

### ソートリセット
```typescript
const handleResetSort = () => {
  setSort({ column: 'id', order: 'asc' })
  router.push(`${FAMILY_QUESTS_URL}?tab=family`)
}
```
