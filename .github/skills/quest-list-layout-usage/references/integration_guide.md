# クエストリストレイアウト - React Query統合ガイド

**最終更新:** 2026年3月記載

## React Queryとの統合パターン

### カスタムフックの構造

**ファイル:** `app/api/quests/family/query.ts`

```typescript
import { useQuery } from "@tanstack/react-query"
import { fetchFamilyQuests } from "./client"

export const useFamilyQuests = ({
  filter,
  sortColumn,
  sortOrder,
  page,
  pageSize
}: {
  filter: FamilyQuestFilterType
  sortColumn: string
  sortOrder: "asc" | "desc"
  page: number
  pageSize: number
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["familyQuests", filter, sortColumn, sortOrder, page, pageSize],
    queryFn: () => fetchFamilyQuests({ filter, sortColumn, sortOrder, page, pageSize }),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })

  return {
    fetchedQuests: data?.quests ?? [],
    totalRecords: data?.totalRecords ?? 0,
    maxPage: data?.maxPage ?? 1,
    isLoading,
    error,
    refetch
  }
}
```

### APIクライアント関数

**ファイル:** `app/api/quests/family/client.ts`

```typescript
import { FAMILY_QUESTS_API } from "@/app/(core)/endpoints"
import { FamilyQuestFilterType } from "./query"

export const fetchFamilyQuests = async ({
  filter,
  sortColumn,
  sortOrder,
  page,
  pageSize
}: {
  filter: FamilyQuestFilterType
  sortColumn: string
  sortOrder: "asc" | "desc"
  page: number
  pageSize: number
}) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortColumn,
    sortOrder,
    ...Object.fromEntries(
      Object.entries(filter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
  })

  const response = await fetch(`${FAMILY_QUESTS_API}?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch family quests")
  }

  return response.json()
}
```

## リスト状態管理パターン

### 2つの状態を分離する理由

```typescript
// エディット用フィルター（ユーザーが編集中）
const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({ tags: [] })

// 検索用フィルター（実際にAPI呼び出しに使用）
const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({ tags: [] })
```

**理由:**
1. **編集中の値を保持:** ユーザーがフィルターポップアップで値を変更中でも、検索実行前は古い検索結果を表示
2. **検索実行の明示化:** 検索ボタンを押すまでAPI呼び出しが発生しない
3. **パフォーマンス向上:** リアルタイム検索を避け、意図的な検索のみ実行

### 状態同期フロー

```typescript
// 1. URL変更時にquestFilterを同期
useEffect(() => {
  const queryObj = Object.fromEntries(searchParams.entries())
  const parsedQuery = {
    ...queryObj,
    tags: queryObj.tags ? queryObj.tags.split(",") : []
  }
  setQuestFilter(FamilyQuestFilterScheme.parse(parsedQuery))
}, [searchParams.toString()])

// 2. 検索実行時にsearchFilterを更新
const handleSearch = useCallback(() => {
  const params = new URLSearchParams(
    Object.entries(questFilter)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  )
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  setSearchFilter(questFilter) // ← ここで同期
}, [questFilter, router])
```

## ページネーション統合

### 無限スクロール用の状態管理

```typescript
const [page, setPage] = useState<number>(1)
const pageSize = 30

// React Queryフック
const { fetchedQuests, isLoading, maxPage } = useFamilyQuests({
  filter: searchFilter,
  sortColumn: sort.column,
  sortOrder: sort.order,
  page,
  pageSize
})

// ページ変更ハンドラ
const handlePageChange = useCallback((newPage: number) => {
  setPage(newPage)
}, [])

// QuestListLayoutに渡す
<QuestListLayout
  page={page}
  maxPage={maxPage}
  onPageChange={handlePageChange}
  // ...
/>
```

### 検索時のページリセット

```typescript
const handleSearch = useCallback(() => {
  // URLを更新
  const params = new URLSearchParams(/*...*/)
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  
  // フィルター更新
  setSearchFilter(questFilter)
  
  // ページをリセット（重要！）
  setPage(1)
}, [questFilter, router])
```

## React Queryキャッシュ戦略

### QueryKey設計

```typescript
// ✅ 良い例: すべての依存を含める
queryKey: ["familyQuests", filter, sortColumn, sortOrder, page, pageSize]

// ❌ 悪い例: 依存を省略
queryKey: ["familyQuests"] // キャッシュが正しく無効化されない
```

### Stale Timeの設定

```typescript
// 頻繁に変更される（リアルタイム性が重要）
staleTime: 0 // 常に最新を取得

// たまに変更される（5分程度のキャッシュOK）
staleTime: 1000 * 60 * 5

// ほぼ変更されない（マスターデータ）
staleTime: 1000 * 60 * 30
```

### クエストカテゴリの取得

```typescript
export const useQuestCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["questCategories"],
    queryFn: fetchQuestCategories,
    staleTime: 1000 * 60 * 30, // 30分間キャッシュ（マスターデータのため）
  })

  const questCategoryById = useMemo(() => {
    return data?.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {} as QuestCategoryById) ?? {}
  }, [data])

  return {
    questCategories: data ?? [],
    questCategoryById,
    isLoading,
    error
  }
}
```

## データプリフェッチ

### 次ページのプリフェッチ

```typescript
import { useQueryClient } from "@tanstack/react-query"

const FamilyQuestListComponent = () => {
  const queryClient = useQueryClient()
  
  // 現在のページデータ取得
  const { fetchedQuests, page, maxPage } = useFamilyQuests({/*...*/})
  
  // 次ページをプリフェッチ
  useEffect(() => {
    if (page < maxPage) {
      queryClient.prefetchQuery({
        queryKey: ["familyQuests", searchFilter, sort.column, sort.order, page + 1, pageSize],
        queryFn: () => fetchFamilyQuests({
          filter: searchFilter,
          sortColumn: sort.column,
          sortOrder: sort.order,
          page: page + 1,
          pageSize
        })
      })
    }
  }, [page, maxPage, searchFilter, sort, pageSize, queryClient])
  
  return <QuestListLayout {...props} />
}
```

## エラーハンドリング

### React Query Error Boundary

```typescript
export const useFamilyQuests = ({/*...*/}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["familyQuests", /*...*/],
    queryFn: () => fetchFamilyQuests({/*...*/}),
    retry: 3, // 3回リトライ
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
    throwOnError: true, // Error Boundaryに伝播
  })

  return {
    fetchedQuests: data?.quests ?? [],
    totalRecords: data?.totalRecords ?? 0,
    maxPage: data?.maxPage ?? 1,
    isLoading,
    error,
    refetch
  }
}
```

### コンポーネントレベルのエラー処理

```typescript
const FamilyQuestListComponent = () => {
  const { fetchedQuests, isLoading, error, refetch } = useFamilyQuests({/*...*/})
  
  if (error) {
    return (
      <Center h="calc(100vh - 200px)">
        <Stack align="center">
          <Text>クエスト一覧の取得に失敗しました</Text>
          <Button onClick={() => refetch()}>再試行</Button>
        </Stack>
      </Center>
    )
  }
  
  return <QuestListLayout {...props} />
}
```

## ミューテーション連携

### クエスト削除後のキャッシュ無効化

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteFamilyQuest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (questId: string) => deleteFamilyQuest(questId),
    onSuccess: () => {
      // 家族クエスト一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["familyQuests"] })
    }
  })
}
```

### 楽観的更新

```typescript
export const useUpdateFamilyQuest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFamilyQuestInput }) => 
      updateFamilyQuest(id, data),
    onMutate: async ({ id, data }) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ["familyQuests"] })
      
      // 現在のキャッシュを取得
      const previousQuests = queryClient.getQueryData(["familyQuests"])
      
      // 楽観的更新
      queryClient.setQueryData(["familyQuests"], (old: any) => {
        return {
          ...old,
          quests: old.quests.map((q: FamilyQuest) => 
            q.quest.id === id ? { ...q, quest: { ...q.quest, ...data } } : q
          )
        }
      })
      
      // ロールバック用のコンテキストを返す
      return { previousQuests }
    },
    onError: (err, variables, context) => {
      // エラー時にロールバック
      queryClient.setQueryData(["familyQuests"], context?.previousQuests)
    },
    onSettled: () => {
      // 最終的にキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["familyQuests"] })
    }
  })
}
```

## パフォーマンス最適化

### useMemoとuseCallbackの活用

```typescript
// ✅ 良い例: 計算をメモ化
const filterCount = useMemo(() => {
  let count = 0
  if (searchFilter.name) count++
  if (searchFilter.tags?.length) count += searchFilter.tags.length
  return count
}, [searchFilter])

// ✅ 良い例: イベントハンドラをメモ化
const handlePageChange = useCallback((newPage: number) => {
  setPage(newPage)
}, [])

// ❌ 悪い例: メモ化なし
const filterCount = calculateFilterCount(searchFilter) // 毎レンダリング実行
const handlePageChange = (newPage: number) => setPage(newPage) // 毎回新しい関数
```

### React Query DevTools

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## ベストプラクティスまとめ

1. **QueryKeyは完全に:** すべての依存を含める
2. **状態を分離:** 編集用と検索用のフィルターを分ける
3. **ページをリセット:** 検索実行時は必ずpage=1に
4. **エラーハンドリング:** retry, retryDelay, throwOnErrorを設定
5. **キャッシュ無効化:** ミューテーション成功時にinvalidateQueries
6. **プリフェッチ:** 次ページを先読みして体験向上
7. **メモ化:** useMemo/useCallbackで不要な再計算を防ぐ
