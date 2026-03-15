# コメント一覧 - データ取得

**2026年3月記載**

## 概要

コメント一覧画面では、React Queryを使用して公開クエストに紐づくコメントを取得します。

## React Query フック

### useComments

**ファイル:** `app/(app)/quests/public/_hooks/useComments.ts`

**責務:** 公開クエストのコメント一覧を取得

**実装:**
```typescript
export const useComments = (publicQuestId: string) => {
  const router = useRouter()
  
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["comments", publicQuestId],
    retry: false,
    queryFn: () => getComments(publicQuestId),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!publicQuestId,
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    comments: data?.comments ?? [],
    pinnedComments: data?.pinnedComments ?? [],
    isLoading,
    refetch
  }
}
```

**パラメータ:**
- `publicQuestId: string` - 公開クエストID

**返り値:**
- `comments: Comment[]` - 通常コメント一覧
- `pinnedComments: Comment[]` - ピン留めコメント一覧
- `isLoading: boolean` - ローディング状態
- `refetch: () => void` - 再取得関数

## APIクライアント

### getComments

**ファイル:** `app/api/quests/public/[id]/comments/client.ts`

**エンドポイント:** `GET /api/quests/public/[id]/comments`

**レスポンス:**
```typescript
type GetCommentsResponse = {
  comments: Comment[]
  pinnedComments: Comment[]
}

type Comment = {
  id: string
  publicQuestId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  likeCount: number
  dislikeCount: number
  isPinned: boolean
  hasCreatorLike: boolean
  createdAt: Date
  updatedAt: Date
}
```

## キャッシュ戦略

### QueryKey構成
```typescript
["comments", publicQuestId]
```

**特徴:**
- 公開クエストごとに個別のキャッシュ
- publicQuestIdが変更されると新しいクエリとして扱われる

### キャッシュ設定
- `staleTime`: 0（常に最新データを取得）
- `cacheTime`: デフォルト（5分）
- `retry`: false（エラー時にリトライしない）
- `refetchOnMount`: "always"（マウント時に常に再取得）
- `enabled`: !!publicQuestId（publicQuestIdがある場合のみクエリ実行）

### 再取得トリガー
- コメント投稿
- コメント削除
- 評価（高評価・低評価）
- ピン留め変更
- 公開者いいね
- 不適切コメント報告（モデレーション後）

## ページネーション

### 現在の実装
現在、ページネーションは実装されていません。すべてのコメントを一度に取得して表示します。

### 将来的な実装案
```typescript
type GetCommentsParams = {
  page: number
  pageSize: number
  sortColumn?: "createdAt" | "likeCount"
  sortOrder?: "asc" | "desc"
}
```

## 無限スクロール

### 現在の実装
現在、無限スクロールは実装されていません。

### 将来的な実装案
```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["comments", publicQuestId],
  queryFn: ({ pageParam = 1 }) => getComments(publicQuestId, pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextPage,
})
```

## 評価機能のデータ取得

### いいね（高評価）

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/like`

**処理フロー:**
1. API呼び出し
2. 成功時に`likeCount`を+1
3. ユーザーの評価状態を記録
4. `refetch()`で最新データ取得（楽観的更新も可能）

### よくないね（低評価）

**API:** `POST /api/quests/public/[publicQuestId]/comments/[commentId]/dislike`

**処理フロー:**
1. API呼び出し
2. 成功時に`dislikeCount`を+1
3. ユーザーの評価状態を記録
4. `refetch()`で最新データ取得

### 評価取り消し

**API:** `DELETE /api/quests/public/[publicQuestId]/comments/[commentId]/like`

**処理フロー:**
1. API呼び出し
2. 成功時にカウントを-1
3. ユーザーの評価状態を削除
4. `refetch()`で最新データ取得

## エラーハンドリング

### クライアント側エラーハンドリング
```typescript
if (error) handleAppError(error, router)
```

**エラータイプ:**
- 認証エラー → ログイン画面へリダイレクト
- 権限エラー → エラー画面表示
- ネットワークエラー → エラーメッセージ表示
- 存在しない公開クエストID → 404エラー

## データ更新フロー

### コメント投稿時
1. コメント投稿APIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. 新しいコメントを含む一覧を再表示

### コメント削除時
1. 削除APIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. 削除されたコメントを除く一覧を再表示

### 評価時
1. 評価APIを呼び出し
2. 楽観的更新でUIを即座に反映
3. 成功時に`refetch()`で最新データ取得
4. 失敗時にロールバック

### ピン留め変更時
1. ピン留めAPIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. ピン留めコメントが最上部に移動

## 楽観的更新（Optimistic Update）

### 評価時の楽観的更新
```typescript
const { mutate: likeComment } = useMutation({
  mutationFn: (commentId: string) => postLike(publicQuestId, commentId),
  onMutate: async (commentId) => {
    // クエリをキャンセル
    await queryClient.cancelQueries(["comments", publicQuestId])
    
    // 前の値を保存
    const previousComments = queryClient.getQueryData(["comments", publicQuestId])
    
    // 楽観的更新
    queryClient.setQueryData(["comments", publicQuestId], (old: any) => {
      return {
        ...old,
        comments: old.comments.map((c: Comment) =>
          c.id === commentId ? { ...c, likeCount: c.likeCount + 1 } : c
        )
      }
    })
    
    return { previousComments }
  },
  onError: (err, variables, context) => {
    // エラー時にロールバック
    if (context?.previousComments) {
      queryClient.setQueryData(["comments", publicQuestId], context.previousComments)
    }
  },
  onSettled: () => {
    // 最新データを取得
    queryClient.invalidateQueries(["comments", publicQuestId])
  },
})
```
