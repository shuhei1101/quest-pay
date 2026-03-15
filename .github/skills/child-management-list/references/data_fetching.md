# 子供管理一覧 - データ取得

**2026年3月記載**

## 概要

子供管理一覧画面では、React Queryを使用して子供データと関連するクエスト統計情報を取得します。

## React Query フック

### useChildren

**ファイル:** `app/(app)/children/_hook/useChildren.ts`

**責務:** 家族に紐づく子供リストとクエスト統計を取得

**実装:**
```typescript
export const useChildren = () => {
  const router = useRouter()
  // 家族の子供を取得する
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["children"],
    retry: false,
    queryFn: () => getChildren()
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    children: data?.children ?? [],
    questStats: data?.questStats ?? {},
    isLoading,
    refetch
  }
}
```

**返り値:**
- `children: Child[]` - 子供リスト
- `questStats: Record<string, QuestStats>` - 子供IDごとのクエスト統計
- `isLoading: boolean` - ローディング状態
- `refetch: () => void` - 再取得関数

## APIクライアント

### getChildren

**ファイル:** `app/api/children/client.ts`

**エンドポイント:** `GET /api/children`

**レスポンス:**
```typescript
type GetChildrenResponse = {
  children: Child[]
  questStats: Record<string, QuestStats>
}

type QuestStats = {
  total: number
  inProgress: number
  completed: number
  pendingReview: number
}
```

## キャッシュ戦略

### QueryKey構成
```typescript
["children"]
```

### キャッシュ設定
- `staleTime`: デフォルト（5分）
- `cacheTime`: デフォルト（5分）
- `retry`: false（エラー時にリトライしない）
- `refetchOnMount`: "always"（マウント時に常に再取得）

### 再取得トリガー
- 子供の作成
- 子供情報の更新
- 子供の削除
- クエスト完了時（統計情報の更新）

## ページネーション

現在、ページネーションは実装されていません。すべての子供を一度に取得して表示します。

## 無限スクロール

現在、無限スクロールは実装されていません。

## エラーハンドリング

### クライアント側エラーハンドリング
```typescript
if (error) handleAppError(error, router)
```

**エラータイプ:**
- 認証エラー → ログイン画面へリダイレクト
- 権限エラー → エラー画面表示
- ネットワークエラー → エラーメッセージ表示

## データ更新フロー

### 作成時
1. 新規作成APIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. 一覧を再取得して表示更新

### 更新時
1. 更新APIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. 一覧を再取得して表示更新

### 削除時
1. 削除APIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. 一覧を再取得して表示更新
