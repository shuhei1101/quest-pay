(2026年3月記載)

# 公開クエスト一覧 データ取得パターン

## API構造

### エンドポイント
- `GET /api/quests/public`: 公開クエスト一覧取得
- `POST /api/quests/public/[id]/like`: いいね
- `DELETE /api/quests/public/[id]/like`: いいね取り消し
- `GET /api/quests/public/[id]/comments`: コメント一覧
- `POST /api/quests/public/[id]/comments`: コメント投稿

### ファイル構成
```
packages/web/app/api/quests/public/
├── route.ts                    # GET（一覧）
├── client.ts                   # APIクライアント関数
├── query.ts                    # React Queryフック
└── [id]/
    ├── route.ts               # GET（詳細）
    ├── like/
    │   └── route.ts           # POST/DELETE（いいね）
    └── comments/
        └── route.ts           # GET/POST（コメント）
```

## React Query フック

### usePublicQuests
**ファイル**: `app/(app)/quests/public/_hooks/usePublicQuests.ts`

```typescript
export function usePublicQuests(params: {
  search?: string
  categoryId?: number
  sortBy?: SortOption
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['quests', 'public', params],
    queryFn: () => fetchPublicQuests(params),
    staleTime: 1000 * 60 * 5, // 5分
    keepPreviousData: true, // ページング時の切り替わり改善
  })
}
```

**特徴**:
- 検索・フィルタ条件をクエリキーに含める
- keepPreviousDataでスムーズなページ遷移
- 5分間のキャッシュ保持

### useInfinitePublicQuests
**無限スクロール版**:

```typescript
export function useInfinitePublicQuests(params: {
  search?: string
  categoryId?: number
  sortBy?: SortOption
}) {
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
```

### useLikePublicQuest
**ファイル**: `app/(app)/quests/public/_hooks/useLikePublicQuest.ts`

```typescript
export function useLikePublicQuest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ questId, isLiked }: { questId: string; isLiked: boolean }) => 
      isLiked ? unlikePublicQuest(questId) : likePublicQuest(questId),
    onMutate: async ({ questId, isLiked }) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: ['quests', 'public'] })
      
      const previousQuests = queryClient.getQueryData(['quests', 'public'])
      
      queryClient.setQueryData(['quests', 'public'], (old: any) => {
        return {
          ...old,
          quests: old.quests.map((q: PublicQuest) => 
            q.id === questId 
              ? { 
                  ...q, 
                  likeCount: q.likeCount + (isLiked ? -1 : 1),
                  isLikedByCurrentUser: !isLiked 
                }
              : q
          ),
        }
      })
      
      return { previousQuests }
    },
    onError: (err, variables, context) => {
      // エラー時はロールバック
      queryClient.setQueryData(['quests', 'public'], context?.previousQuests)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['quests', 'public'] })
    },
  })
}
```

**特徴**:
- 楽観的更新による即座のUI反映
- エラー時の自動ロールバック
- いいね数の即座更新

## データフロー

### 初期ロード
```
Component Mount
    ↓
usePublicQuests()
    ↓
React Query Cache Check
    ↓
API Call: GET /api/quests/public
    ↓
Database Query with JOIN (public_quests, families, quest_categories)
    ↓
Response: { quests: PublicQuest[], totalCount: number }
    ↓
Cache Update
    ↓
Component Re-render
```

### いいねフロー
```
User Click "Like"
    ↓
useLikePublicQuest.mutate({ questId, isLiked })
    ↓
Optimistic Update (UI即座反映)
    ↓
API Call: POST /api/quests/public/[id]/like
    ↓
Database Insert into public_quest_likes
    ↓
success → invalidateQueries(['quests', 'public'])
    ↓
Background Refetch
    ↓
Cache Update with real data
```

### 検索・フィルタフロー
```
User Input Search/Filter
    ↓
State Update (debounced)
    ↓
usePublicQuests re-run with new params
    ↓
New Query Key → Cache Miss
    ↓
API Call with params
    ↓
Database Query with WHERE clause
    ↓
Response with filtered results
    ↓
List Re-render
```

## キャッシュ戦略

### クエリキー構造
```typescript
['quests', 'public']                              // 全公開クエスト
['quests', 'public', { search: 'study' }]        // 検索結果
['quests', 'public', { categoryId: 1 }]          // カテゴリフィルタ
['quests', 'public', { sortBy: 'popular' }]      // ソート
['quests', 'public', 'infinite', params]         // 無限スクロール
['quest', 'public', questId]                     // 個別クエスト詳細
```

### Stale Time
- クエスト一覧: 5分
- 個別クエスト: 10分
- いいね・コメント数: 2分

### Cache Time
- デフォルト: 10分（使用されなくなったキャッシュの保持時間）

### Refetch 戦略
- フォーカス時: `refetchOnWindowFocus: false`（頻繁な再取得を防ぐ）
- マウント時: `refetchOnMount: true`
- 再接続時: `refetchOnReconnect: true`

## パフォーマンス最適化

### デバウンス検索
```typescript
const [searchQuery, setSearchQuery] = useState('')
const debouncedSearch = useDebounce(searchQuery, 500)

const { data } = usePublicQuests({ search: debouncedSearch })
```

### ページング vs 無限スクロール
```typescript
// デスクトップ: ページング
const { data } = usePublicQuests({ page, pageSize: 20 })

// モバイル: 無限スクロール
const { data, fetchNextPage, hasNextPage } = useInfinitePublicQuests({ ... })
```

### 画像遅延読み込み
```typescript
<Image
  src={quest.imageUrl}
  loading="lazy"
  placeholder="blur"
/>
```

### 仮想スクロール（大量データ時）
```typescript
import { FixedSizeGrid } from 'react-window'

<FixedSizeGrid
  columnCount={3}
  columnWidth={300}
  height={600}
  rowCount={Math.ceil(quests.length / 3)}
  rowHeight={400}
  width={920}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 3 + columnIndex
    return (
      <div style={style}>
        {quests[index] && <PublicQuestCard quest={quests[index]} />}
      </div>
    )
  }}
</FixedSizeGrid>
```

## エラーハンドリング

### ネットワークエラー
```typescript
const { data, error, isError } = usePublicQuests(params)

if (isError) {
  return (
    <ErrorState 
      message="クエストの取得に失敗しました" 
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

## 認証状態の考慮

### 認証なしでも閲覧可能
```typescript
// route.ts
export async function GET(request: Request) {
  // 認証チェックなし
  const quests = await fetchPublicQuests()
  return NextResponse.json(quests)
}
```

### いいね・コメントは認証必要
```typescript
// like/route.ts
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // いいね処理
}
```
