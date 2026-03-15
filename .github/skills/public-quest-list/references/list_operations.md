(2026年3月15日 14:30記載)

# 公開クエスト一覧 リスト操作

## 基本操作

### 1. 公開クエスト一覧取得

**API**: `GET /api/quests/public`

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| search | string | No | 検索キーワード（タイトル・説明文） |
| categoryId | number | No | カテゴリID |
| sortBy | string | No | 'popular' \| 'latest' \| 'commented' |
| page | number | No | ページ番号（デフォルト: 1） |
| pageSize | number | No | 1ページあたりの件数（デフォルト: 20） |

**Response**:
```typescript
{
  quests: PublicQuest[]
  totalCount: number
  currentPage: number
  totalPages: number
}

type PublicQuest = {
  id: string
  familyQuestId: string
  familyId: string
  familyName: string
  title: string
  description: string
  imageUrl?: string
  categoryId: number
  categoryName: string
  likeCount: number
  commentCount: number
  isLikedByCurrentUser: boolean
  publishedAt: string
  createdAt: string
}
```

### 2. いいね

**API**: `POST /api/quests/public/[id]/like`

**認証**: 必須

**Request Body**:
```typescript
{
  // Bodyなし
}
```

**Response**:
```typescript
{
  success: boolean
  likeCount: number
}
```

### 3. いいね取り消し

**API**: `DELETE /api/quests/public/[id]/like`

**認証**: 必須

**Request Body**:
```typescript
{
  // Bodyなし
}
```

**Response**:
```typescript
{
  success: boolean
  likeCount: number
}
```

## 検索

### キーワード検索
```typescript
const [searchQuery, setSearchQuery] = useState('')

const { data } = usePublicQuests({ search: searchQuery })
```

### サーバー側検索
```typescript
// route.ts
let query = db
  .select()
  .from(publicQuests)
  .leftJoin(families, eq(publicQuests.familyId, families.id))
  .leftJoin(questCategories, eq(publicQuests.categoryId, questCategories.id))

if (search) {
  query = query.where(
    or(
      like(publicQuests.title, `%${search}%`),
      like(publicQuests.description, `%${search}%`)
    )
  )
}
```

### デバウンス検索
```typescript
import { useDebouncedValue } from '@mantine/hooks'

const [searchQuery, setSearchQuery] = useState('')
const [debouncedSearch] = useDebouncedValue(searchQuery, 500)

const { data } = usePublicQuests({ search: debouncedSearch })
```

## フィルタリング

### カテゴリフィルタ
```typescript
const [categoryId, setCategoryId] = useState<number | undefined>()

const { data } = usePublicQuests({ categoryId })
```

### サーバー側フィルタ
```typescript
// route.ts
if (categoryId) {
  query = query.where(eq(publicQuests.categoryId, categoryId))
}
```

### 複合フィルタ
```typescript
const { data } = usePublicQuests({
  search: searchQuery,
  categoryId: selectedCategory,
  sortBy: selectedSort,
})
```

## ソート

### ソートオプション
```typescript
type SortOption = 'popular' | 'latest' | 'commented'
```

### サーバー側ソート
```typescript
// route.ts
switch (sortBy) {
  case 'popular':
    query = query.orderBy(desc(publicQuests.likeCount))
    break
  case 'latest':
    query = query.orderBy(desc(publicQuests.publishedAt))
    break
  case 'commented':
    query = query.orderBy(desc(publicQuests.commentCount))
    break
  default:
    query = query.orderBy(desc(publicQuests.publishedAt))
}
```

### UIコンポーネント
```typescript
<Select
  label="並び替え"
  value={sortBy}
  onChange={setSortBy}
  data={[
    { value: 'popular', label: '人気順' },
    { value: 'latest', label: '新着順' },
    { value: 'commented', label: 'コメント数順' },
  ]}
/>
```

## ページネーション

### 従来型ページネーション
```typescript
const [page, setPage] = useState(1)
const pageSize = 20

const { data } = usePublicQuests({ page, pageSize })

<Pagination
  value={page}
  onChange={setPage}
  total={data?.totalPages || 1}
/>
```

### 無限スクロール（推奨）
```typescript
export function useInfinitePublicQuests(params: QueryParams) {
  return useInfiniteQuery({
    queryKey: ['quests', 'public', 'infinite', params],
    queryFn: ({ pageParam = 0 }) => 
      fetchPublicQuests({ ...params, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => 
        sum + page.quests.length, 0
      )
      return loadedCount < lastPage.totalCount ? loadedCount : undefined
    },
  })
}

// 使用例
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfinitePublicQuests({ search, categoryId })

<InfiniteScroll
  loadMore={fetchNextPage}
  hasMore={hasNextPage}
  isLoading={isFetchingNextPage}
>
  {data?.pages.flatMap(page => page.quests).map(quest => (
    <PublicQuestCard key={quest.id} quest={quest} />
  ))}
</InfiniteScroll>
```

## いいね操作

### いいねトグル
```typescript
const { mutate: toggleLike } = useLikePublicQuest()

const handleLike = (quest: PublicQuest) => {
  toggleLike({
    questId: quest.id,
    isLiked: quest.isLikedByCurrentUser,
  })
}
```

### 楽観的更新
```typescript
export function useLikePublicQuest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ questId, isLiked }: LikeParams) => 
      isLiked ? unlikePublicQuest(questId) : likePublicQuest(questId),
    
    onMutate: async ({ questId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['quests', 'public'] })
      
      const previousData = queryClient.getQueryData(['quests', 'public'])
      
      // UI即座更新
      queryClient.setQueriesData(
        { queryKey: ['quests', 'public'] },
        (old: any) => ({
          ...old,
          quests: old?.quests.map((q: PublicQuest) => 
            q.id === questId 
              ? {
                  ...q,
                  likeCount: q.likeCount + (isLiked ? -1 : 1),
                  isLikedByCurrentUser: !isLiked,
                }
              : q
          ),
        })
      )
      
      return { previousData }
    },
    
    onError: (err, variables, context) => {
      // ロールバック
      queryClient.setQueryData(
        ['quests', 'public'],
        context?.previousData
      )
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['quests', 'public'] })
    },
  })
}
```

### いいね済み判定
```typescript
const isLiked = quest.isLikedByCurrentUser

<ActionIcon
  color={isLiked ? 'red' : 'gray'}
  variant={isLiked ? 'filled' : 'subtle'}
  onClick={() => handleLike(quest)}
>
  <IconHeart />
</ActionIcon>
```

## コメント操作

### コメントモーダル表示
```typescript
const [selectedQuest, setSelectedQuest] = useState<PublicQuest | null>(null)
const [commentModalOpened, setCommentModalOpened] = useState(false)

const openCommentModal = (quest: PublicQuest) => {
  setSelectedQuest(quest)
  setCommentModalOpened(true)
}
```

### コメント一覧取得
```typescript
const { data: comments } = useQuery({
  queryKey: ['quest', 'public', selectedQuest?.id, 'comments'],
  queryFn: () => fetchPublicQuestComments(selectedQuest!.id),
  enabled: !!selectedQuest,
})
```

### コメント投稿
```typescript
const { mutate: postComment } = useMutation({
  mutationFn: ({ questId, content }: CommentParams) => 
    postPublicQuestComment(questId, content),
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: ['quest', 'public', selectedQuest?.id, 'comments'] 
    })
    queryClient.invalidateQueries({ 
      queryKey: ['quests', 'public'] 
    })
  },
})
```

## クエスト詳細遷移

### カードクリック
```typescript
const router = useRouter()

const handleCardClick = (quest: PublicQuest) => {
  router.push(`/quests/public/${quest.id}`)
}

<Card onClick={() => handleCardClick(quest)} style={{ cursor: 'pointer' }}>
  {/* カード内容 */}
</Card>
```

## パフォーマンス最適化

### カードのメモ化
```typescript
const PublicQuestCard = memo(({ quest, onLike }: Props) => {
  // コンポーネント実装
}, (prev, next) => {
  return prev.quest.id === next.quest.id &&
         prev.quest.likeCount === next.quest.likeCount &&
         prev.quest.isLikedByCurrentUser === next.quest.isLikedByCurrentUser
})
```

### 画像遅延読み込み
```typescript
<Image
  src={quest.imageUrl}
  loading="lazy"
  fallbackSrc="/images/quest-placeholder.png"
/>
```

### 仮想スクロール（大量データ）
```typescript
import { FixedSizeGrid } from 'react-window'

<FixedSizeGrid
  columnCount={isMobile ? 1 : 3}
  columnWidth={isMobile ? width : 300}
  height={600}
  rowCount={Math.ceil(quests.length / (isMobile ? 1 : 3))}
  rowHeight={400}
  width={width}
>
  {/* グリッドアイテム */}
</FixedSizeGrid>
```

## エラーハンドリング

### リスト取得エラー
```typescript
const { data, error, isError } = usePublicQuests(params)

if (isError) {
  return (
    <ErrorState
      message="公開クエストの取得に失敗しました"
      onRetry={() => queryClient.invalidateQueries(['quests', 'public'])}
    />
  )
}
```

### いいねエラー
```typescript
const { mutate: toggleLike } = useLikePublicQuest({
  onError: (error) => {
    logger.error('いいね処理失敗', { error })
    showNotification({
      title: 'エラー',
      message: 'いいねに失敗しました',
      color: 'red',
    })
  },
})
```

### 認証エラー
```typescript
if (error?.response?.status === 401) {
  openLoginModal()
  return
}
```

## 空状態

### 検索結果なし
```typescript
if (data?.quests.length === 0 && searchQuery) {
  return (
    <EmptyState
      title="検索結果がありません"
      description={`"${searchQuery}" に一致するクエストが見つかりませんでした`}
      icon={<IconSearch size={48} />}
    />
  )
}
```

### フィルタ結果なし
```typescript
if (data?.quests.length === 0 && categoryId) {
  return (
    <EmptyState
      title="クエストがありません"
      description="このカテゴリにはまだ公開クエストがありません"
      icon={<IconInbox size={48} />}
    />
  )
}
```
