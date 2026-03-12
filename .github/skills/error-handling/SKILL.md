---
name: error-handling
description: エラーハンドリングの知識を提供するスキル。エラークラス定義、クライアント/サーバーエラーハンドラーを含む。
---

# エラーハンドリングスキル

## 概要

このスキルは、Quest Payアプリケーションにおけるエラーハンドリングユーティリティの知識を提供する。エラークラス定義、クライアント/サーバー両方のエラーハンドラー、エラーバウンダリーのフォールバックコンポーネントを網羅する。

## ファイル構成

### エラークラス定義
- **`/packages/web/app/(core)/error/appError.ts`**: アプリケーション固有のエラークラス
  - `AppError`: 基底エラークラス
  - `ClientValueError`: クライアントバリデーションエラー
  - `ClientAuthError`: クライアント認証エラー

### エラーハンドラー
- **`/packages/web/app/(core)/error/handler/client.ts`**: クライアントサイドエラーハンドラー
- **`/packages/web/app/(core)/error/handler/server.ts`**: サーバーサイドエラーハンドラー

### エラーバウンダリー
- **`/packages/web/app/(core)/error/ErrorFallback.tsx`**: エラーバウンダリーのフォールバックコンポーネント

## エラークラス (appError.ts)

### ErrorResponseScheme
```typescript
export const ErrorResponseScheme = z.object({
  code: z.string(),
  message: z.string(),
  path: z.string().optional(),
})
export type ErrorResponse = z.infer<typeof ErrorResponseScheme>
```

### AppError (基底クラス)
```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public path = '',
  )
  
  public toResponse(): ErrorResponse
  static fromResponse(data: any, status: number): AppError
}
```

**プロパティ:**
- `code`: エラーコード
- `status`: HTTPステータスコード
- `message`: エラーメッセージ
- `path`: エラー発生パス（オプション）

**メソッド:**
- `toResponse()`: エラーをレスポンス形式に変換
- `fromResponse()`: レスポンスからエラーインスタンスを生成

### ClientValueError (クライアントバリデーションエラー)
```typescript
export const CLIENT_VALUE_ERROR_CODE = 'CLIENT_ERROR'
export class ClientValueError extends AppError {
  constructor(message = '不正な値が入力されました。', path = '')
}
```

デフォルトメッセージ: 「不正な値が入力されました。」

### ClientAuthError (クライアント認証エラー)
```typescript
export const CLIENT_AUTH_ERROR_CODE = 'CLIENT_AUTH_ERROR'
export class ClientAuthError extends AppError
```

### 定数
- `UNKNOWN_ERROR`: 'UNKNOWN_ERROR' - 不明なエラーコード
- `APP_ERROR`: 'AppError' - アプリエラー識別子
- `CLIENT_VALUE_ERROR_CODE`: 'CLIENT_ERROR' - クライアントエラーコード
- `CLIENT_AUTH_ERROR_CODE`: 'CLIENT_AUTH_ERROR' - 認証エラーコード

## クライアントサイドエラーハンドラー (handler/client.ts)

### handleAppError
```typescript
export const handleAppError = async (
  error: Error,
  router: AppRouterInstance
) => {
  devLog("handleAppError.エラー内容: ", error)
  
  // 次画面で表示するメッセージを登録
  appStorage.feedbackMessage.set({ 
    message: error.message, 
    type: "error" 
  })
  
  // 前画面がある場合、遷移する
  let redirectUrl = appStorage.parentScreen.get()
  if (!redirectUrl) {
    // サインアウトする
    await createClient().auth.signOut()
    redirectUrl = ROOT_URL
  }
  
  router.push(`${redirectUrl}`)
}
```

**処理フロー:**
1. エラー内容をログ出力
2. フィードバックメッセージをセッションストレージに保存
3. 前画面URLを取得
4. 前画面がない場合:
   - サインアウト実行
   - ルートURLへリダイレクト
5. 前画面がある場合:
   - 前画面へリダイレクト

**使用モジュール:**
- `appStorage.feedbackMessage`: フィードバックメッセージ管理
- `appStorage.parentScreen`: 前画面URL管理
- `createClient().auth.signOut()`: Supabase認証サインアウト

## サーバーサイドエラーハンドラー (handler/server.ts)

### withRouteErrorHandling
```typescript
export async function withRouteErrorHandling(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof AppError) {
      // アプリ固有エラーのハンドル
      devLog("withRouteErrorHandling.サーバ内例外: ", error, error.path)
      return NextResponse.json(error.toResponse(), { status: error.status })
    } else {
      devLog("withRouteErrorHandling.想定外の例外: ", error)
      // 想定外のエラー
      return NextResponse.json({
        code: UNKNOWN_ERROR, 
        message: error instanceof Error ? error.message : String(error),
      } as ErrorResponse, { status: 500 })
    }
  }
}
```

**処理フロー:**
1. コールバック関数を実行
2. `AppError` の場合:
   - エラーログを出力
   - `toResponse()` でレスポンスに変換
   - エラーのステータスコードでレスポンス
3. 想定外のエラーの場合:
   - エラーログを出力
   - `UNKNOWN_ERROR` コードでレスポンス
   - ステータスコード 500 で返却

**使用例:**
```typescript
export async function POST(request: Request) {
  return withRouteErrorHandling(async () => {
    // API処理
    return NextResponse.json({ data: "success" })
  })
}
```

## エラーバウンダリーフォールバック (ErrorFallback.tsx)

### ErrorFallback
```typescript
export const ErrorFallback = ({ error }: FallbackProps) => {
  useEffect(() => {
    // 次画面で表示するメッセージを登録
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error)
    appStorage.feedbackMessage.set({ 
      message: errorMessage, 
      type: "error" 
    })
    
    // ログイン画面にリダイレクトする
    redirect(LOGIN_URL)
  }, [error])

  return null
}
```

**処理フロー:**
1. エラーメッセージを取得
2. セッションストレージに保存
3. ログイン画面へリダイレクト
4. レンダリングは行わない（`return null`）

**使用ライブラリ:**
- `react-error-boundary`: `FallbackProps` 型

## 使用パターン

### クライアントエラーハンドリング
```typescript
"use client"

import { handleAppError } from "@/app/(core)/error/handler/client"
import { useRouter } from "next/navigation"

export const MyComponent = () => {
  const router = useRouter()
  
  const handleSubmit = async () => {
    try {
      // 処理
    } catch (error) {
      await handleAppError(error as Error, router)
    }
  }
}
```

### サーバーエラーハンドリング
```typescript
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { AppError } from "@/app/(core)/error/appError"

export async function POST(request: Request) {
  return withRouteErrorHandling(async () => {
    const data = await request.json()
    
    if (!data.id) {
      throw new AppError(
        'VALIDATION_ERROR',
        400,
        'IDが必要です',
        'data.id'
      )
    }
    
    return NextResponse.json({ success: true })
  })
}
```

### カスタムエラー作成
```typescript
import { AppError } from "@/app/(core)/error/appError"

// カスタムエラークラス
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(
      'NOT_FOUND',
      404,
      `${resource}が見つかりません`,
      ''
    )
  }
}

// 使用例
throw new NotFoundError('クエスト')
```

## 設計原則

1. **統一されたエラーレスポンス**: すべてのエラーは `ErrorResponse` 型に統一
2. **適切なログ出力**: クライアント/サーバー両方で `devLog` を使用
3. **ユーザーフィードバック**: エラーメッセージはセッションストレージで次画面に引き継ぐ
4. **セキュリティ**: 想定外のエラーは詳細を隠してログに記録
5. **型安全性**: Zodスキーマでエラーレスポンスを検証

## 関連スキル
- `error-structure`: エラー画面の構造知識
- `endpoints-definition`: エンドポイント定義の知識
- `database-operations`: データベース操作のエラーハンドリング
