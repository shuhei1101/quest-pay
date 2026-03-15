# 共通コンポーネント統合パターン

**最終更新:** 2026年3月記載

## 統合パターン概要

共通コンポーネントを効果的に統合するためのデザインパターンとアーキテクチャガイド。

## レイアウトパターン

### パターン1: 基本画面レイアウト

**適用ケース:** 単純なコンテンツ表示画面

**構成:**
```
ScreenWrapper
└── PageHeader
    └── コンテンツエリア
        └── NavigationFAB (オプション)
```

**実装例:**
```typescript
export default function BasicScreen() {
  return (
    <ScreenWrapper>
      <PageHeader title="タイトル" />
      <Container>
        {/* コンテンツ */}
      </Container>
      <NavigationFAB items={navItems} />
    </ScreenWrapper>
  )
}
```

### パターン2: タブ画面レイアウト

**適用ケース:** タブで切り替えるコンテンツがある画面

**構成:**
```
ScreenWrapper
└── PageHeader
    └── ScrollableTabs
        ├── タブパネル1
        ├── タブパネル2
        └── タブパネル3
    └── SubMenuFAB (オプション)
```

**実装例:**
```typescript
export default function TabScreen() {
  const [activeTab, setActiveTab] = useState('tab1')
  
  return (
    <ScreenWrapper>
      <PageHeader title="タブ画面" />
      <ScrollableTabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        tabs={[
          { value: 'tab1', label: 'タブ1' },
          { value: 'tab2', label: 'タブ2' },
          { value: 'tab3', label: 'タブ3' }
        ]}
      >
        {activeTab === 'tab1' && <TabPanel1 />}
        {activeTab === 'tab2' && <TabPanel2 />}
        {activeTab === 'tab3' && <TabPanel3 />}
      </ScrollableTabs>
      <SubMenuFAB items={menuItems} />
    </ScreenWrapper>
  )
}
```

### パターン3: 一覧画面レイアウト

**適用ケース:** リスト表示とカード表示を行う画面

**構成:**
```
ScreenWrapper
└── PageHeader (右側にアクション)
    └── SearchBar
        └── FilterPopup / SortPopup
            └── カード一覧
                └── EmptyState (データなし時)
```

**実装例:**
```typescript
export default function ListScreen() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState([])
  
  return (
    <ScreenWrapper>
      <PageHeader 
        title="一覧" 
        rightSection={
          <NavigationButton href="/new">新規作成</NavigationButton>
        }
      />
      <SearchBar value={search} onChange={setSearch} />
      <Group>
        <FilterPopup 
          options={filterOptions} 
          selectedValues={filter}
          onChange={setFilter} 
        />
        <SortPopup 
          options={sortOptions} 
          selectedValue={sort}
          onChange={setSort}
        />
      </Group>
      <Stack>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <QuestCard key={item.id} quest={item} onClick={() => navigate(item.id)} />
          ))
        ) : (
          <EmptyState 
            message="データがありません" 
            actionLabel="新規作成"
            onAction={() => navigate('/new')}
          />
        )}
      </Stack>
    </ScreenWrapper>
  )
}
```

### パターン4: フォーム画面レイアウト

**適用ケース:** データ入力・編集画面

**構成:**
```
ScreenWrapper
└── PageHeader
    └── QuestForm / カスタムフォーム
        └── LoadingButton (送信)
```

**実装例:**
```typescript
export default function FormScreen() {
  const handleSubmit = async (values: FormValues) => {
    await api.submit(values)
    router.push('/success')
  }
  
  return (
    <ScreenWrapper>
      <PageHeader title="編集" />
      <QuestForm 
        initialValues={initialValues} 
        onSubmit={handleSubmit}
        submitLabel="保存"
      />
    </ScreenWrapper>
  )
}
```

### パターン5: 詳細画面レイアウト

**適用ケース:** データ詳細表示画面

**構成:**
```
ScreenWrapper
└── PageHeader (右側に編集ボタン)
    └── QuestDetail / カスタム詳細表示
        └── アクションエリア
            ├── LikeButton
            ├── ReportButton
            └── その他アクション
```

**実装例:**
```typescript
export default function DetailScreen() {
  return (
    <ScreenWrapper>
      <PageHeader 
        title="詳細" 
        rightSection={
          <NavigationButton href={`/edit/${id}`}>
            <IconEdit />
          </NavigationButton>
        }
      />
      <QuestDetail quest={quest} />
      <Group>
        <LikeButton 
          liked={quest.liked} 
          likeCount={quest.likeCount}
          onLike={handleLike} 
        />
        <ReportButton onReport={handleReport} />
      </Group>
    </ScreenWrapper>
  )
}
```

## 状態管理パターン

### パターン6: ローディング状態管理

**LoadingContext を使用:**

```typescript
// Provider設定（_app.tsx または layout.tsx）
export default function App({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <Component {...pageProps} />
      <LoadingIndicator />
    </LoadingProvider>
  )
}

// 使用側
export default function Screen() {
  const { startLoading, stopLoading } = useLoading()
  
  const loadData = async () => {
    startLoading()
    try {
      await fetchData()
    } finally {
      stopLoading()
    }
  }
  
  return <ScreenWrapper>...</ScreenWrapper>
}
```

### パターン7: フォーム状態管理

**React Hook Form との統合:**

```typescript
import { useForm } from 'react-hook-form'

export default function FormScreen() {
  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      description: ''
    }
  })
  
  const handleSubmit = async (values: FormValues) => {
    await api.submit(values)
  }
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <TextInput {...form.register('title')} />
      <Textarea {...form.register('description')} />
      <LoadingButton type="submit">送信</LoadingButton>
    </form>
  )
}
```

### パターン8: React Query との統合

**データフェッチとキャッシュ管理:**

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

export default function ListScreen() {
  const { data: quests, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: fetchQuests
  })
  
  const deleteMutation = useMutation({
    mutationFn: deleteQuest,
    onSuccess: () => {
      queryClient.invalidateQueries(['quests'])
    }
  })
  
  if (isLoading) return <LoadingSpinner />
  
  return (
    <ScreenWrapper>
      <Stack>
        {quests.map(quest => (
          <QuestCard 
            key={quest.id} 
            quest={quest}
            onDelete={() => deleteMutation.mutate(quest.id)}
          />
        ))}
      </Stack>
    </ScreenWrapper>
  )
}
```

## ナビゲーションパターン

### パターン9: 階層ナビゲーション

**NavigationFAB + PageHeader連携:**

```typescript
const navItems: NavigationFABItem[] = [
  { icon: <IconHome />, label: 'ホーム', onClick: () => router.push('/') },
  { icon: <IconClipboard />, label: 'クエスト', onClick: () => router.push('/quests') },
  { icon: <IconUsers />, label: 'メンバー', onClick: () => router.push('/members') }
]

export default function Screen() {
  const currentIndex = 1 // クエスト画面
  
  return (
    <ScreenWrapper>
      <PageHeader title="クエスト" />
      {/* コンテンツ */}
      <NavigationFAB items={navItems} activeIndex={currentIndex} />
    </ScreenWrapper>
  )
}
```

### パターン10: コンテキストメニュー

**SubMenuFAB活用:**

```typescript
const menuItems: SubMenuFABItem[] = [
  { 
    icon: <IconEdit />, 
    label: '編集', 
    onClick: () => router.push(`/edit/${id}`),
    color: 'blue'
  },
  { 
    icon: <IconTrash />, 
    label: '削除', 
    onClick: handleDelete,
    color: 'red'
  },
  { 
    icon: <IconShare />, 
    label: '共有', 
    onClick: handleShare,
    color: 'green'
  }
]

export default function DetailScreen() {
  return (
    <ScreenWrapper>
      <PageHeader title="詳細" />
      {/* コンテンツ */}
      <SubMenuFAB items={menuItems} />
    </ScreenWrapper>
  )
}
```

## エラーハンドリングパターン

### パターン11: グローバルエラーハンドリング

**ErrorBoundary + ErrorMessage:**

```typescript
// エラーバウンダリ設定
export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary 
      fallback={
        <ScreenWrapper>
          <ErrorMessage 
            message="エラーが発生しました" 
            onRetry={() => window.location.reload()}
          />
        </ScreenWrapper>
      }
    >
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
```

### パターン12: 個別エラーハンドリング

**try-catch + 通知:**

```typescript
export default function FormScreen() {
  const handleSubmit = async (values: FormValues) => {
    try {
      await api.submit(values)
      showNotification({
        title: '成功',
        message: '保存しました',
        color: 'green'
      })
      router.push('/success')
    } catch (error) {
      showNotification({
        title: 'エラー',
        message: error.message,
        color: 'red'
      })
    }
  }
  
  return (
    <ScreenWrapper>
      <QuestForm onSubmit={handleSubmit} />
    </ScreenWrapper>
  )
}
```

## 条件付きレンダリングパターン

### パターン13: 空状態とローディング

**EmptyState + LoadingSpinner:**

```typescript
export default function ListScreen() {
  const { data: items, isLoading } = useQuery(['items'], fetchItems)
  
  if (isLoading) {
    return (
      <ScreenWrapper>
        <Center h="100vh">
          <LoadingSpinner size="xl" />
        </Center>
      </ScreenWrapper>
    )
  }
  
  if (!items || items.length === 0) {
    return (
      <ScreenWrapper>
        <PageHeader title="一覧" />
        <EmptyState 
          message="データがありません" 
          actionLabel="新規作成"
          onAction={() => router.push('/new')}
        />
      </ScreenWrapper>
    )
  }
  
  return (
    <ScreenWrapper>
      <PageHeader title="一覧" />
      <Stack>
        {items.map(item => (
          <QuestCard key={item.id} quest={item} />
        ))}
      </Stack>
    </ScreenWrapper>
  )
}
```

## レスポンシブパターン

### パターン14: デバイス別レイアウト

**useMediaQuery使用:**

```typescript
import { useMediaQuery } from '@mantine/hooks'

export default function ResponsiveScreen() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <ScreenWrapper>
      <PageHeader title="タイトル" />
      {isMobile ? (
        <>
          {/* モバイルレイアウト */}
          <Stack>
            <QuestCard />
          </Stack>
          <BottomBar items={navItems} />
        </>
      ) : (
        <>
          {/* デスクトップレイアウト */}
          <Grid>
            <Grid.Col span={3}>
              <SideMenu items={navItems} />
            </Grid.Col>
            <Grid.Col span={9}>
              <QuestCard />
            </Grid.Col>
          </Grid>
        </>
      )}
    </ScreenWrapper>
  )
}
```

## まとめ

これらの統合パターンを活用して、一貫性のある効率的な画面実装を行ってください。パターンは必要に応じて組み合わせたり、カスタマイズしたりできます。
