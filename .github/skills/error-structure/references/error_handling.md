(2026年3月記載)

# エラーハンドリング詳細

## エラークラス階層

```typescript
AppError (基底クラス)
├── ClientError (クライアント側エラー)
│   ├── 401 Unauthorized (認証エラー)
│   ├── 403 Forbidden (権限エラー)
│   ├── 404 Not Found (リソース未存在)
│   └── 400 Bad Request (不正なリクエスト)
└── ServerError (サーバー側エラー)
    ├── 500 Internal Server Error (内部エラー)
    ├── 503 Service Unavailable (サービス利用不可)
    └── 504 Gateway Timeout (タイムアウト)
```

## エラーハンドラーの責務分離

### クライアント側エラーハンドラー
**ファイル**: `app/(core)/error/handler/client.ts`

**関数**: `handleAppError(error: unknown, router: AppRouterInstance)`

**責務**:
- API呼び出しエラーのクライアント側処理
- エラータイプに応じた適切な処理の振り分け
- toast通知の表示
- 必要に応じてページ遷移

**処理フロー**:
```typescript
export const handleAppError = (error: unknown, router: AppRouterInstance) => {
  if (error instanceof ClientError) {
    // 401/403 の場合は認証エラーページへリダイレクト
    if (error.statusCode === 401 || error.statusCode === 403) {
      appStorage.feedbackMessage.in({
        type: "error",
        message: error.message || "認証に失敗しました",
      })
      router.push("/error/unauthorized")
      return
    }
    
    // その他のClientErrorはtoast表示
    toast.error(error.message)
  } else if (error instanceof ServerError) {
    // ServerErrorはtoast表示
    toast.error(error.message || "サーバーエラーが発生しました")
  } else {
    // 予期しないエラーはtoast表示
    toast.error("予期しないエラーが発生しました")
  }
}
```

### サーバー側エラーハンドラー
**ファイル**: `app/(core)/error/handler/server.ts`

**関数**: `withRouteErrorHandling(handler: () => Promise<NextResponse>)`

**責務**:
- API Route内のエラーをキャッチ
- エラーログの記録
- 適切なHTTPステータスコードとメッセージ返却

**処理フロー**:
```typescript
export const withRouteErrorHandling = async (
  handler: () => Promise<NextResponse>
): Promise<NextResponse> => {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof ClientError) {
      logger.warn('ClientError発生', {
        statusCode: error.statusCode,
        message: error.message,
      })
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    if (error instanceof ServerError) {
      logger.error('ServerError発生', {
        message: error.message,
        stack: error.stack,
      })
      return NextResponse.json(
        { error: error.message || "サーバーエラーが発生しました" },
        { status: 500 }
      )
    }
    
    // 予期しないエラー
    logger.error('予期しないエラー発生', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: "予期しないエラーが発生しました" },
      { status: 500 }
    )
  }
}
```

## エラーの発生場所と処理方法

### 1. API Route内でのエラー
**発生場所**: `app/api/**/*.ts`

**例**:
```typescript
export async function GET(request: Request) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()  // 認証失敗時に401エラースロー
    
    // データ取得失敗時にServerErrorスロー
    const data = await fetchData({ db })
    if (!data) throw new ServerError("データの取得に失敗しました")
    
    return NextResponse.json({ data })
  })
}
```

**処理フロー**:
1. `getAuthContext()` で認証失敗 → `ClientError(401)` スロー
2. `withRouteErrorHandling` がキャッチ
3. `NextResponse.json({ error: "認証に失敗しました" }, { status: 401 })` 返却
4. クライアント側で401レスポンス受信
5. `handleAppError` が `/error/unauthorized` へリダイレクト

### 2. React Query (useMutation) でのエラー
**発生場所**: `app/**/_hooks/use*.ts`

**例**:
```typescript
export const usePostComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      postComment({ content }),
    onError: (error) => handleAppError(error, router),
    onSuccess: () => {
      toast.success("コメントを投稿しました")
    },
  })
  
  return { handlePostComment: mutation.mutate, isLoading: mutation.isPending }
}
```

**処理フロー**:
1. APIエラーレスポンス受信
2. `onError` コールバックが実行される
3. `handleAppError` がエラータイプを判定
4. 適切な処理（toast表示 or ページ遷移）

### 3. コンポーネント内でのエラー
**発生場所**: `app/**/*.tsx`

**例1: try-catch でのエラーハンドリング**:
```typescript
const handleSubmit = async () => {
  try {
    const result = await someAsyncOperation()
    toast.success("成功しました")
  } catch (error) {
    handleAppError(error, router)
  }
}
```

**例2: Error Boundaryでキャッチ**:
```typescript
// コンポーネント内で予期しないエラーが発生
const Component = () => {
  const data = useSomeData()
  
  if (!data) {
    throw new Error("データの取得に失敗しました")  // Error Boundaryがキャッチ
  }
  
  return <div>{data.name}</div>
}
```

## エラーメッセージの設計原則

### ユーザー向けメッセージ
**原則**:
- 何が起きたかを明確に伝える
- 次に何をすべきかを示唆する
- 専門用語を避ける

**良い例**:
```typescript
"認証に失敗しました。再度ログインしてください。"
"データの取得に失敗しました。しばらく時間をおいてから再度お試しください。"
"入力内容に誤りがあります。確認してください。"
```

**悪い例**:
```typescript
"Error: 401"
"DB query failed"
"Something went wrong"
```

### 開発者向けログ
**原則**:
- 詳細なエラー情報を記録
- スタックトレースを含める
- エラー発生のコンテキストを記録

**例**:
```typescript
logger.error('コメント投稿失敗', {
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
  userId,
  publicQuestId,
  content: content.substring(0, 100),  // 最初の100文字のみログ
})
```

## エラーリカバリー戦略

### 1. 再試行 (Retry)
**適用場面**: 一時的なネットワークエラー、タイムアウト

**実装例**:
```typescript
const mutation = useMutation({
  mutationFn: postComment,
  retry: 2,  // 2回まで自動再試行
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})
```

### 2. フォールバック (Fallback)
**適用場面**: データ取得失敗時にキャッシュやデフォルト値を使用

**実装例**:
```typescript
const { data } = useQuery({
  queryKey: ["comments"],
  queryFn: fetchComments,
  placeholderData: [],  // 取得失敗時は空配列を表示
})
```

### 3. 楽観的更新のロールバック
**適用場面**: ミューテーション失敗時に楽観的更新を取り消す

**実装例**:
```typescript
const mutation = useMutation({
  mutationFn: postComment,
  onMutate: async (newComment) => {
    // 楽観的更新
    const previousComments = queryClient.getQueryData(["comments"])
    queryClient.setQueryData(["comments"], [...previousComments, newComment])
    return { previousComments }
  },
  onError: (err, newComment, context) => {
    // エラー時はロールバック
    queryClient.setQueryData(["comments"], context.previousComments)
  },
})
```

### 4. 安全な場所への遷移
**適用場面**: 回復不能なエラー、認証エラー

**実装例**:
```typescript
// 認証エラー → ログインページ
router.push("/error/unauthorized")

// 予期しないエラー → ホームページ
router.push(HOME_URL)
```

## エラーバウンダリーの配置戦略

### グローバルエラーバウンダリー
**ファイル**: `app/error.tsx`

**カバー範囲**: アプリケーション全体

**キャッチするエラー**:
- コンポーネントレンダリング中のエラー
- useEffect内のエラー
- イベントハンドラー内のエラー（try-catchされていないもの）

### レイアウトエラーバウンダリー (今後の拡張)
**配置例**: `app/(app)/error.tsx`, `app/(auth)/error.tsx`

**カバー範囲**: 特定のレイアウト配下

**利点**:
- セクションごとに異なるエラーUIを提供
- エラー発生時も他のセクションは正常動作

## ログレベルの使い分け

### logger.error
**使用場面**: サーバーエラー、予期しないエラー

**例**:
```typescript
logger.error('データベース接続失敗', {
  error: error.message,
  stack: error.stack,
})
```

### logger.warn
**使用場面**: クライアントエラー、想定内のエラー

**例**:
```typescript
logger.warn('親以外のコメント投稿試行', {
  userId,
  profileType: userInfo.profiles.type,
})
```

### logger.info
**使用場面**: API呼び出しの開始・終了

**例**:
```typescript
logger.info('コメント投稿API開始', {
  path: '/api/quests/public/[id]/comments',
  method: 'POST',
})
```

### logger.debug
**使用場面**: デバッグ情報、詳細な処理フロー

**例**:
```typescript
logger.debug('認証コンテキスト取得完了', { userId })
logger.debug('リクエストボディ検証完了', { publicQuestId: id })
```

## エラーの一貫性を保つベストプラクティス

### 1. エラークラスの使用
```typescript
// ❌ 悪い例
throw new Error("認証に失敗しました")

// ✅ 良い例
throw new ClientError("認証に失敗しました", 401)
```

### 2. エラーハンドラーの統一
```typescript
// ❌ 悪い例
try {
  await postComment()
} catch (error) {
  toast.error("エラーが発生しました")
}

// ✅ 良い例
try {
  await postComment()
} catch (error) {
  handleAppError(error, router)  // 統一されたハンドリング
}
```

### 3. ログの構造化
```typescript
// ❌ 悪い例
logger.error(`コメント投稿失敗: ${error.message}`)

// ✅ 良い例
logger.error('コメント投稿失敗', {
  error: error.message,
  userId,
  publicQuestId,
})
```

### 4. ユーザーへの適切なフィードバック
```typescript
// ❌ 悪い例
throw new ServerError("Database query failed")

// ✅ 良い例
throw new ServerError("データの取得に失敗しました。しばらく時間をおいてから再度お試しください。")
```

## エラーモニタリングとアラート

### 想定されるエラーモニタリング戦略
1. **エラーログの集約**: logger経由で記録されたエラーを外部サービスに送信
2. **エラー率の監視**: 一定時間内のエラー発生率をトラッキング
3. **アラート設定**: 重大なエラー（500系）が閾値を超えた場合に通知

### 実装例 (将来の拡張)
```typescript
// Sentryなどのエラートラッキングサービスとの統合
if (process.env.NODE_ENV === "production") {
  Sentry.captureException(error, {
    contexts: {
      user: { id: userId },
      request: { url: request.url },
    },
  })
}
```
