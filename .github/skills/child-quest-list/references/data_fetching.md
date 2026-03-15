# 子供クエスト一覧 - データ取得

**2026年3月記載**

## 概要

子供クエスト一覧画面では、React Queryを使用して子供が受注したクエストを取得します。フィルターとソートに対応し、ページネーションをサポートします。

## React Query フック

### useChildQuests

**ファイル:** `app/(app)/quests/child/_hooks/useChildQuests.ts`

**責務:** 子供クエストのフィルター、ソート、ページネーション付き取得

**実装:**
```typescript
export const useChildQuests = ({filter, sortColumn, sortOrder, page, pageSize, childId}:{
  filter: ChildQuestFilterType, 
  sortColumn: QuestColumn, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number,
  childId?: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["childQuests", filter, sortColumn, sortOrder, page, pageSize, childId],
    retry: false,
    queryFn: () => getChildQuests({
      childId: childId!,
      params: {
        tags: filter.tags,
        name: filter.name,
        categoryId: filter.categoryId,
        sortColumn,
        sortOrder,
        page,
        pageSize,
      },
    }),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!childId,
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    fetchedQuests: data?.rows ?? [],
    totalRecords: data?.totalRecords ?? 0,
    maxPage: Math.ceil((data?.totalRecords ?? 0) / pageSize),
    isLoading,
    refetch
  }
}
```

**パラメータ:**
- `filter: ChildQuestFilterType` - フィルター条件
- `sortColumn: QuestColumn` - ソート列
- `sortOrder: SortOrder` - ソート順
- `page: number` - ページ番号
- `pageSize: number` - ページサイズ
- `childId?: string` - 子供ID

**返り値:**
- `fetchedQuests: ChildQuest[]` - 取得したクエスト一覧
- `totalRecords: number` - 総件数
- `maxPage: number` - 最大ページ数
- `isLoading: boolean` - ローディング状態
- `refetch: () => void` - 再取得関数

## APIクライアント

### getChildQuests

**ファイル:** `app/api/children/[id]/quests/client.ts`

**エンドポイント:** `GET /api/children/[id]/quests`

**クエリパラメータ:**
```typescript
type GetChildQuestsParams = {
  tags?: string[]
  name?: string
  categoryId?: string
  sortColumn: QuestColumn
  sortOrder: SortOrder
  page: number
  pageSize: number
}
```

**レスポンス:**
```typescript
type GetChildQuestsResponse = {
  rows: ChildQuest[]
  totalRecords: number
}

type ChildQuest = {
  id: string
  familyQuestId: string
  childId: string
  name: string
  description: string
  categoryId: string
  tags: string[]
  reward: number
  status: ChildQuestStatus
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}
```

## キャッシュ戦略

### QueryKey構成
```typescript
["childQuests", filter, sortColumn, sortOrder, page, pageSize, childId]
```

**特徴:**
- フィルター、ソート、ページごとに個別のキャッシュ
- childIdが変更されると新しいクエリとして扱われる

### キャッシュ設定
- `staleTime`: 0（常に最新データを取得）
- `cacheTime`: デフォルト（5分）
- `retry`: false（エラー時にリトライしない）
- `refetchOnMount`: "always"（マウント時に常に再取得）
- `enabled`: !!childId（childIdがある場合のみクエリ実行）

### 再取得トリガー
- フィルター変更
- ソート変更
- ページ変更
- ページサイズ変更
- クエストステータス更新（完了報告など）

## ページネーション

### 実装
```typescript
const pageSize = 30

const { fetchedQuests, totalRecords, maxPage } = useChildQuests({
  filter: searchFilter,
  sortColumn: sort.column,
  sortOrder: sort.order,
  page,
  pageSize,
  childId: userInfo?.children?.id
})
```

### ページ変更
```typescript
const handlePageChange = useCallback((newPage: number) => {
  setPage(newPage)
}, [])
```

### 最大ページ数計算
```typescript
maxPage = Math.ceil(totalRecords / pageSize)
```

## 無限スクロール

現在、無限スクロールは実装されていません。ページネーションのみ対応しています。

## フィルター機能

### フィルタータイプ
```typescript
type ChildQuestFilterType = {
  name?: string
  tags: string[]
  categoryId?: string
}
```

### フィルター適用フロー
```
1. ユーザーがフィルター入力
   ↓
2. questFilter 状態を更新
   ↓
3. 「検索」ボタンクリック
   ↓
4. searchFilter を更新
   ↓
5. useChildQuests が再実行
   ↓
6. 新しい結果を取得・表示
```

### URLクエリパラメータとの同期
```typescript
// フィルターをURLに反映
const paramsObj = Object.fromEntries(
  Object.entries(questFilter)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => [k, String(v)])
)
const params = new URLSearchParams(paramsObj)
router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
```

## ソート機能

### ソートタイプ
```typescript
type QuestSort = {
  column: QuestColumn
  order: SortOrder
}

type QuestColumn = "id" | "name" | "categoryId" | "reward" | "deadline"
type SortOrder = "asc" | "desc"
```

### ソート変更フロー
```
1. ユーザーがソート列/順を選択
   ↓
2. sort 状態を更新
   ↓
3. useChildQuests が再実行
   ↓
4. 新しい順序で結果を取得・表示
```

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

### 完了報告時
1. 完了報告APIを呼び出し
2. 成功時に`refetch()`を呼び出し
3. ステータスが`pending_review`に更新された一覧を再表示

### 承認時（親側の操作）
1. 承認APIを呼び出し
2. ステータスが`completed`に更新
3. 子供側の画面では次回マウント時に自動再取得
