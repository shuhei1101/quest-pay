(2026年3月記載)

# テンプレートクエスト一覧 リスト操作

## 基本操作

### 1. テンプレートクエスト一覧取得

**API**: `GET /api/quests/template`

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| categoryId | number | No | カテゴリID |

**Response**:
```typescript
{
  quests: TemplateQuest[]
}

type TemplateQuest = {
  id: string
  title: string
  description: string
  imageUrl?: string
  categoryId: number
  categoryName: string
  difficulty: 1 | 2 | 3
  recommendedAge: string
  reward: number
  exp: number
  createdAt: string
}
```

### 2. テンプレート詳細取得

**API**: `GET /api/quests/template/[id]`

**Response**:
```typescript
{
  quest: TemplateQuestDetail
}

type TemplateQuestDetail = TemplateQuest & {
  longDescription: string
  tips: string[]
  prerequisites: string[]
}
```

### 3. テンプレート採用

**API**: `POST /api/quests/family/adopt`

**認証**: 必須（親のみ）

**Request Body**:
```typescript
{
  templateId: string
  familyId: string
  customization?: {
    title?: string
    description?: string
    reward?: number
  }
}
```

**Response**:
```typescript
{
  familyQuest: FamilyQuest
  message: string
}
```

## フィルタリング

### カテゴリフィルタ
```typescript
const [categoryId, setCategoryId] = useState<number | undefined>()

const { data } = useTemplateQuests({ categoryId })
```

### サーバー側フィルタ
```typescript
// route.ts
let query = db
  .select()
  .from(templateQuests)
  .leftJoin(questCategories, eq(templateQuests.categoryId, questCategories.id))

if (categoryId) {
  query = query.where(eq(templateQuests.categoryId, categoryId))
}
```

### カテゴリタブUI
```typescript
<Tabs value={categoryId?.toString()} onChange={(value) => setCategoryId(value ? Number(value) : undefined)}>
  <Tabs.List>
    <Tabs.Tab value="all">すべて</Tabs.Tab>
    <Tabs.Tab value="1">お手伝い</Tabs.Tab>
    <Tabs.Tab value="2">勉強</Tabs.Tab>
    <Tabs.Tab value="3">運動</Tabs.Tab>
    <Tabs.Tab value="4">趣味</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## ソート

### デフォルトソート
- カテゴリごとの推奨順
- 難易度順（簡単→難しい）

### サーバー側ソート
```typescript
// route.ts
query = query.orderBy(
  asc(templateQuests.categoryId),
  asc(templateQuests.difficulty),
  asc(templateQuests.title)
)
```

## テンプレート採用

### 採用処理
```typescript
const { mutate: adoptQuest, isLoading } = useAdoptTemplateQuest()

const handleAdopt = (templateId: string) => {
  adoptQuest(templateId)
}

<Button
  onClick={() => handleAdopt(quest.id)}
  loading={isLoading}
>
  採用する
</Button>
```

### 確認ダイアログ付き採用
```typescript
const handleAdoptWithConfirm = (quest: TemplateQuest) => {
  modals.openConfirmModal({
    title: 'テンプレートを採用',
    children: (
      <Stack>
        <Text>「{quest.title}」を家族クエストとして採用しますか?</Text>
        <Text size="sm" c="dimmed">
          採用後、詳細を編集できます。
        </Text>
      </Stack>
    ),
    labels: { confirm: '採用する', cancel: 'キャンセル' },
    onConfirm: () => adoptQuest(quest.id),
  })
}
```

### カスタマイズ付き採用（将来実装）
```typescript
const [customization, setCustomization] = useState({
  title: quest.title,
  description: quest.description,
  reward: quest.reward,
})

const handleAdoptWithCustomization = () => {
  adoptQuest({
    templateId: quest.id,
    customization,
  })
}

<Modal opened={opened} onClose={close}>
  <Stack>
    <TextInput
      label="タイトル"
      value={customization.title}
      onChange={(e) => setCustomization({ ...customization, title: e.target.value })}
    />
    <Textarea
      label="説明"
      value={customization.description}
      onChange={(e) => setCustomization({ ...customization, description: e.target.value })}
    />
    <NumberInput
      label="報酬"
      value={customization.reward}
      onChange={(value) => setCustomization({ ...customization, reward: value })}
    />
    <Button onClick={handleAdoptWithCustomization}>採用する</Button>
  </Stack>
</Modal>
```

## 詳細表示

### 詳細モーダル
```typescript
const [selectedQuest, setSelectedQuest] = useState<TemplateQuest | null>(null)
const [detailOpened, setDetailOpened] = useState(false)

const openDetail = (quest: TemplateQuest) => {
  setSelectedQuest(quest)
  setDetailOpened(true)
}

const { data: detail } = useQuery({
  queryKey: ['quest', 'template', selectedQuest?.id],
  queryFn: () => fetchTemplateQuestDetail(selectedQuest!.id),
  enabled: !!selectedQuest,
})

<Modal opened={detailOpened} onClose={() => setDetailOpened(false)} size="lg">
  <Stack>
    <Title order={3}>{detail?.title}</Title>
    <Text>{detail?.longDescription}</Text>
    <Group>
      <Badge>難易度: {'★'.repeat(detail?.difficulty || 1)}</Badge>
      <Badge>推奨年齢: {detail?.recommendedAge}</Badge>
    </Group>
    <Text weight={700}>やり方のヒント</Text>
    <List>
      {detail?.tips.map((tip, i) => (
        <List.Item key={i}>{tip}</List.Item>
      ))}
    </List>
    <Button onClick={() => adoptQuest(detail?.id)}>採用する</Button>
  </Stack>
</Modal>
```

## 検索（将来実装）

### キーワード検索
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [debouncedSearch] = useDebouncedValue(searchQuery, 500)

const { data } = useTemplateQuests({ search: debouncedSearch })

<TextInput
  placeholder="テンプレートを検索..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  icon={<IconSearch size={16} />}
/>
```

### サーバー側検索
```typescript
// route.ts
if (search) {
  query = query.where(
    or(
      like(templateQuests.title, `%${search}%`),
      like(templateQuests.description, `%${search}%`)
    )
  )
}
```

## 難易度フィルタ

### 難易度選択
```typescript
const [difficulty, setDifficulty] = useState<1 | 2 | 3 | undefined>()

const { data } = useTemplateQuests({ categoryId, difficulty })

<SegmentedControl
  value={difficulty?.toString() || 'all'}
  onChange={(value) => setDifficulty(value === 'all' ? undefined : Number(value) as 1 | 2 | 3)}
  data={[
    { label: 'すべて', value: 'all' },
    { label: '簡単 ★', value: '1' },
    { label: '普通 ★★', value: '2' },
    { label: '難しい ★★★', value: '3' },
  ]}
/>
```

## プリフェッチ

### カテゴリプリフェッチ
```typescript
const queryClient = useQueryClient()

const prefetchCategory = (categoryId: number) => {
  queryClient.prefetchQuery({
    queryKey: ['quests', 'template', { categoryId }],
    queryFn: () => fetchTemplateQuests({ categoryId }),
  })
}

<Tabs.Tab
  value={category.id.toString()}
  onMouseEnter={() => prefetchCategory(category.id)}
>
  {category.name}
</Tabs.Tab>
```

## パフォーマンス最適化

### カードのメモ化
```typescript
const TemplateQuestCard = memo(({ quest, onAdopt, isAdopting }: Props) => {
  // コンポーネント実装
}, (prev, next) => {
  return prev.quest.id === next.quest.id &&
         prev.isAdopting === next.isAdopting
})
```

### 画像遅延読み込み
```typescript
<Image
  src={quest.imageUrl}
  loading="lazy"
  fallbackSrc="/images/template-placeholder.png"
/>
```

### リスト仮想化（大量データ時）
```typescript
import { FixedSizeGrid } from 'react-window'

<FixedSizeGrid
  columnCount={isMobile ? 1 : 3}
  columnWidth={isMobile ? width : 300}
  height={600}
  rowCount={Math.ceil(quests.length / (isMobile ? 1 : 3))}
  rowHeight={450}
  width={width}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * (isMobile ? 1 : 3) + columnIndex
    const quest = quests[index]
    return quest ? (
      <div style={style}>
        <TemplateQuestCard quest={quest} onAdopt={handleAdopt} />
      </div>
    ) : null
  }}
</FixedSizeGrid>
```

## エラーハンドリング

### 一覧取得エラー
```typescript
const { data, error, isError } = useTemplateQuests({ categoryId })

if (isError) {
  return (
    <ErrorState
      message="テンプレートクエストの取得に失敗しました"
      onRetry={() => queryClient.invalidateQueries(['quests', 'template'])}
    />
  )
}
```

### 採用エラー
```typescript
const { mutate: adoptQuest } = useAdoptTemplateQuest({
  onError: (error) => {
    if (error.response?.status === 403) {
      showNotification({
        title: '権限エラー',
        message: '親のみがテンプレートを採用できます',
        color: 'red',
      })
    } else {
      showNotification({
        title: 'エラー',
        message: 'クエストの採用に失敗しました',
        color: 'red',
      })
    }
    logger.error('テンプレート採用失敗', { error })
  },
})
```

### 権限チェック
```typescript
const { data: currentUser } = useCurrentUser()
const isParent = currentUser?.role === 'parent'

<Button
  onClick={() => adoptQuest(quest.id)}
  disabled={!isParent}
  title={!isParent ? '親のみが採用できます' : undefined}
>
  採用する
</Button>
```

## 空状態

### カテゴリ内が空
```typescript
if (data?.quests.length === 0 && categoryId) {
  return (
    <EmptyState
      title="テンプレートがありません"
      description="このカテゴリにはまだテンプレートがありません"
      icon={<IconInbox size={48} />}
    />
  )
}
```

### 検索結果なし
```typescript
if (data?.quests.length === 0 && searchQuery) {
  return (
    <EmptyState
      title="検索結果がありません"
      description={`"${searchQuery}" に一致するテンプレートが見つかりませんでした`}
      icon={<IconSearch size={48} />}
    />
  )
}
```

## 採用済み表示（将来実装）

### 採用済みバッジ
```typescript
const { data: adoptedQuestIds } = useQuery({
  queryKey: ['quests', 'family', 'adopted-templates'],
  queryFn: fetchAdoptedTemplateIds,
})

const isAdopted = adoptedQuestIds?.includes(quest.id)

<Badge color={isAdopted ? 'gray' : 'blue'}>
  {isAdopted ? '採用済み' : '未採用'}
</Badge>

<Button
  onClick={() => adoptQuest(quest.id)}
  disabled={isAdopted}
>
  {isAdopted ? '採用済み' : '採用する'}
</Button>
```
