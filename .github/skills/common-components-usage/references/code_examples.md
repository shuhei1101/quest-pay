# 共通コンポーネント コード例

**最終更新:** 2026年3月記載

## PageHeader コード例

### 基本的な使用

```typescript
import { PageHeader } from '@/app/(core)/_components/PageHeader'

export default function TimelineScreen() {
  return (
    <>
      <PageHeader title="タイムライン" />
      {/* コンテンツ */}
    </>
  )
}
```

### プロフィールボタンを非表示

```typescript
import { PageHeader } from '@/app/(core)/_components/PageHeader'

export default function LoginScreen() {
  return (
    <>
      <PageHeader title="ログイン" showProfileButton={false} />
      {/* コンテンツ */}
    </>
  )
}
```

### 右側にアクションボタンを配置

```typescript
import { PageHeader } from '@/app/(core)/_components/PageHeader'
import { Button } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function RewardScreen() {
  const router = useRouter()
  
  return (
    <>
      <PageHeader 
        title="定額報酬"
        rightSection={
          <Button 
            leftSection={<IconEdit size={16} />} 
            onClick={() => router.push('/rewards/edit')}
            variant="light"
          >
            編集
          </Button>
        }
      />
      {/* コンテンツ */}
    </>
  )
}
```

## ScrollableTabs コード例

### 基本的な使用

```typescript
import { ScrollableTabs } from '@/app/(core)/_components/ScrollableTabs'
import { useState } from 'react'

export default function QuestScreen() {
  const [activeTab, setActiveTab] = useState<string | null>('all')
  
  const tabs = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '完了' }
  ]
  
  return (
    <ScrollableTabs 
      activeTab={activeTab} 
      onChange={setActiveTab}
      tabs={tabs}
    >
      {activeTab === 'all' && <AllQuestsPanel />}
      {activeTab === 'active' && <ActiveQuestsPanel />}
      {activeTab === 'completed' && <CompletedQuestsPanel />}
    </ScrollableTabs>
  )
}
```

### アイコン付きタブ

```typescript
import { ScrollableTabs } from '@/app/(core)/_components/ScrollableTabs'
import { IconHome, IconClipboard, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<string | null>('home')
  
  const tabs = [
    { 
      value: 'home', 
      label: 'ホーム',
      leftSection: <IconHome size={16} />
    },
    { 
      value: 'quests', 
      label: 'クエスト',
      leftSection: <IconClipboard size={16} />
    },
    { 
      value: 'members', 
      label: 'メンバー',
      leftSection: <IconUsers size={16} />
    }
  ]
  
  return (
    <ScrollableTabs 
      activeTab={activeTab} 
      onChange={setActiveTab}
      tabs={tabs}
    >
      {activeTab === 'home' && <HomePanel />}
      {activeTab === 'quests' && <QuestsPanel />}
      {activeTab === 'members' && <MembersPanel />}
    </ScrollableTabs>
  )
}
```

## NavigationFAB コード例

### 基本的な使用

```typescript
import { NavigationFAB } from '@/app/(core)/_components/NavigationFAB'
import { IconHome, IconClipboard, IconUsers } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function Screen() {
  const router = useRouter()
  
  const navItems = [
    { icon: <IconHome />, label: 'ホーム', onClick: () => router.push('/') },
    { icon: <IconClipboard />, label: 'クエスト', onClick: () => router.push('/quests') },
    { icon: <IconUsers />, label: 'メンバー', onClick: () => router.push('/members') }
  ]
  
  return (
    <>
      {/* コンテンツ */}
      <NavigationFAB items={navItems} activeIndex={0} />
    </>
  )
}
```

### デフォルトで開いた状態

```typescript
import { NavigationFAB } from '@/app/(core)/_components/NavigationFAB'

export default function Screen() {
  return (
    <>
      {/* コンテンツ */}
      <NavigationFAB items={navItems} defaultOpen={true} />
    </>
  )
}
```

## SubMenuFAB コード例

### 基本的な使用

```typescript
import { SubMenuFAB } from '@/app/(core)/_components/SubMenuFAB'
import { IconEdit, IconTrash, IconShare } from '@tabler/icons-react'

export default function DetailScreen() {
  const menuItems = [
    { 
      icon: <IconEdit />, 
      label: '編集', 
      onClick: handleEdit,
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
  
  return (
    <>
      {/* コンテンツ */}
      <SubMenuFAB items={menuItems} />
    </>
  )
}
```

## NavigationButton コード例

### 基本的な使用

```typescript
import { NavigationButton } from '@/app/(core)/_components/NavigationButton'

export default function ListScreen() {
  return (
    <>
      <NavigationButton href="/quests/new">
        新規作成
      </NavigationButton>
    </>
  )
}
```

### アイコン付き

```typescript
import { NavigationButton } from '@/app/(core)/_components/NavigationButton'
import { IconPlus } from '@tabler/icons-react'

export default function ListScreen() {
  return (
    <>
      <NavigationButton 
        href="/quests/new"
        leftSection={<IconPlus size={16} />}
        variant="light"
        color="blue"
      >
        新規作成
      </NavigationButton>
    </>
  )
}
```

## LoadingButton コード例

### 基本的な使用

```typescript
import { LoadingButton } from '@/app/(core)/_components/LoadingButton'

export default function FormScreen() {
  const handleSubmit = async () => {
    await api.submit(formData)
  }
  
  return (
    <form>
      {/* フォームフィールド */}
      <LoadingButton onClick={handleSubmit}>
        送信
      </LoadingButton>
    </form>
  )
}
```

### カスタムローディングメッセージ

```typescript
import { LoadingButton } from '@/app/(core)/_components/LoadingButton'

export default function FormScreen() {
  return (
    <LoadingButton 
      onClick={handleSubmit}
      loadingMessage="保存中..."
      color="green"
      fullWidth
    >
      保存
    </LoadingButton>
  )
}
```

## SearchBar コード例

### 基本的な使用

```typescript
import { SearchBar } from '@/app/(core)/_components/SearchBar'
import { useState } from 'react'

export default function ListScreen() {
  const [search, setSearch] = useState('')
  
  // 検索フィルタリング
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <>
      <SearchBar 
        value={search} 
        onChange={setSearch}
        placeholder="クエストを検索"
      />
      {/* 検索結果 */}
    </>
  )
}
```

## FilterPopup コード例

### 基本的な使用

```typescript
import { FilterPopup } from '@/app/(core)/_components/FilterPopup'
import { useState } from 'react'

export default function ListScreen() {
  const [filter, setFilter] = useState<string[]>([])
  
  const filterOptions = [
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '完了' },
    { value: 'pending', label: '保留中' }
  ]
  
  return (
    <>
      <FilterPopup 
        options={filterOptions}
        selectedValues={filter}
        onChange={setFilter}
        label="ステータスでフィルター"
      />
      {/* フィルター適用済みリスト */}
    </>
  )
}
```

## QuestCard コード例

### 基本的な使用

```typescript
import { QuestCard } from '@/app/(core)/_components/QuestCard'
import { useRouter } from 'next/navigation'

export default function ListScreen() {
  const router = useRouter()
  const { data: quests } = useQuery(['quests'], fetchQuests)
  
  return (
    <Stack>
      {quests.map(quest => (
        <QuestCard 
          key={quest.id}
          quest={quest}
          onClick={() => router.push(`/quests/${quest.id}`)}
          showActions={true}
        />
      ))}
    </Stack>
  )
}
```

## LoadingContext + LoadingIndicator コード例

### Provider設定

```typescript
// app/layout.tsx
import { LoadingProvider } from '@/app/(core)/_components/LoadingContext'
import { LoadingIndicator } from '@/app/(core)/_components/LoadingIndicator'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LoadingProvider>
          {children}
          <LoadingIndicator />
        </LoadingProvider>
      </body>
    </html>
  )
}
```

### 使用側

```typescript
import { useLoading } from '@/app/(core)/_components/LoadingContext'

export default function Screen() {
  const { startLoading, stopLoading } = useLoading()
  
  const loadData = async () => {
    startLoading()
    try {
      const data = await fetchData()
      setData(data)
    } finally {
      stopLoading()
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  return <div>...</div>
}
```

## ScreenWrapper コード例

### 基本的な使用

```typescript
import { ScreenWrapper } from '@/app/(core)/_components/ScreenWrapper'

export default function Screen() {
  return (
    <ScreenWrapper>
      <PageHeader title="タイトル" />
      {/* コンテンツ */}
    </ScreenWrapper>
  )
}
```

## EmptyState コード例

### 基本的な使用

```typescript
import { EmptyState } from '@/app/(core)/_components/EmptyState'
import { IconClipboard } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function ListScreen() {
  const router = useRouter()
  const { data: items } = useQuery(['items'], fetchItems)
  
  if (!items || items.length === 0) {
    return (
      <EmptyState 
        message="クエストがありません" 
        icon={<IconClipboard size={64} />}
        actionLabel="新規作成"
        onAction={() => router.push('/quests/new')}
      />
    )
  }
  
  return <div>...</div>
}
```

## ErrorMessage コード例

### 基本的な使用

```typescript
import { ErrorMessage } from '@/app/(core)/_components/ErrorMessage'

export default function Screen() {
  const { data, error, refetch } = useQuery(['data'], fetchData)
  
  if (error) {
    return (
      <ErrorMessage 
        message={error.message}
        onRetry={refetch}
        retryLabel="再試行"
      />
    )
  }
  
  return <div>...</div>
}
```

## LikeButton コード例

### 基本的な使用

```typescript
import { LikeButton } from '@/app/(core)/_components/LikeButton'
import { useMutation } from '@tanstack/react-query'

export default function QuestDetailScreen() {
  const [liked, setLiked] = useState(quest.liked)
  const [likeCount, setLikeCount] = useState(quest.likeCount)
  
  const likeMutation = useMutation({
    mutationFn: () => api.likeQuest(quest.id),
    onSuccess: () => {
      setLiked(!liked)
      setLikeCount(prev => liked ? prev - 1 : prev + 1)
    }
  })
  
  return (
    <LikeButton 
      liked={liked}
      likeCount={likeCount}
      onLike={likeMutation.mutate}
    />
  )
}
```

## ReportButton コード例

### 基本的な使用

```typescript
import { ReportButton } from '@/app/(core)/_components/ReportButton'
import { useMutation } from '@tanstack/react-query'

export default function QuestDetailScreen() {
  const reportMutation = useMutation({
    mutationFn: () => api.reportQuest(quest.id),
    onSuccess: () => {
      showNotification({
        title: '完了報告',
        message: '報告しました',
        color: 'green'
      })
    }
  })
  
  return (
    <ReportButton 
      onReport={reportMutation.mutate}
      confirmMessage="完了報告しますか?"
    />
  )
}
```

## 複合例: 完全な画面実装

```typescript
import { ScreenWrapper } from '@/app/(core)/_components/ScreenWrapper'
import { PageHeader } from '@/app/(core)/_components/PageHeader'
import { SearchBar } from '@/app/(core)/_components/SearchBar'
import { FilterPopup } from '@/app/(core)/_components/FilterPopup'
import { QuestCard } from '@/app/(core)/_components/QuestCard'
import { EmptyState } from '@/app/(core)/_components/EmptyState'
import { NavigationButton } from '@/app/(core)/_components/NavigationButton'
import { NavigationFAB } from '@/app/(core)/_components/NavigationFAB'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { Stack, Group } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function QuestListScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string[]>([])
  
  const { data: quests, isLoading } = useQuery(['quests'], fetchQuests)
  
  const filteredQuests = useMemo(() => {
    if (!quests) return []
    
    return quests.filter(quest => {
      const matchSearch = quest.title.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter.length === 0 || filter.includes(quest.status)
      return matchSearch && matchFilter
    })
  }, [quests, search, filter])
  
  const filterOptions = [
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '完了' },
    { value: 'pending', label: '保留中' }
  ]
  
  const navItems = [
    { icon: <IconHome />, label: 'ホーム', onClick: () => router.push('/') },
    { icon: <IconClipboard />, label: 'クエスト', onClick: () => router.push('/quests') },
    { icon: <IconUsers />, label: 'メンバー', onClick: () => router.push('/members') }
  ]
  
  return (
    <ScreenWrapper>
      <PageHeader 
        title="クエスト一覧"
        rightSection={
          <NavigationButton 
            href="/quests/new"
            leftSection={<IconPlus size={16} />}
            variant="light"
          >
            新規作成
          </NavigationButton>
        }
      />
      <SearchBar 
        value={search} 
        onChange={setSearch}
        placeholder="クエストを検索"
      />
      <Group>
        <FilterPopup 
          options={filterOptions}
          selectedValues={filter}
          onChange={setFilter}
          label="ステータス"
        />
      </Group>
      {isLoading ? (
        <Center h="50vh">
          <LoadingSpinner size="xl" />
        </Center>
      ) : filteredQuests.length > 0 ? (
        <Stack>
          {filteredQuests.map(quest => (
            <QuestCard 
              key={quest.id}
              quest={quest}
              onClick={() => router.push(`/quests/${quest.id}`)}
              showActions={true}
            />
          ))}
        </Stack>
      ) : (
        <EmptyState 
          message="クエストがありません" 
          actionLabel="新規作成"
          onAction={() => router.push('/quests/new')}
        />
      )}
      <NavigationFAB items={navItems} activeIndex={1} />
    </ScreenWrapper>
  )
}
```
