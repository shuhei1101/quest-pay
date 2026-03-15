# Error Handler Patterns リファレンス
> 2026年3月記載

## 概要

クライアントサイドとサーバーサイドのエラーハンドラーパターンと実装ガイド。

## クライアントサイドエラーハンドラー

### handler/client.ts

#### handleAppError

クライアントサイドで発生したエラーを処理し、適切なフィードバックを提供。

```typescript
export const handleAppError = async (
  error: Error,
  router: AppRouterInstance
) => {
  logger.debug("handleAppError.エラー内容: ", error)
  
  // 次画面で表示するメッセージを登録
  appStorage.feedbackMessage.set({ 
    message: error.message, 
    type: "error" 
  })
  
  // エラーコードに応じた処理
  if (error instanceof AppError) {
    switch (error.code) {
      case 'CLIENT_AUTH_ERROR':
        // 認証エラー -> ログイン画面へ
        router.push(LOGIN_URL)
        break
      
      default:
        // その他のエラー -> エラー画面へ
        router.push(ERROR_URL)
        break
    }
  } else {
    // 予期しないエラー
    router.push(ERROR_URL)
  }
}
```

#### 主要機能

1. **エラーログ出力**: デバッグ用にエラー内容を記録
2. **フィードバックメッセージ登録**: 次画面で表示するメッセージを保存
3. **エラーコード別ルーティング**: エラータイプに応じて適切な画面へ遷移

#### 使用例

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { handleAppError } from '@/(core)/error/handler/client'

export function QuestForm() {
  const router = useRouter()
  
  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/quests/family', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw AppError.fromResponse(errorData, response.status)
      }
      
      // 成功処理
    } catch (error) {
      // エラーハンドラーに委譲
      await handleAppError(error as Error, router)
    }
  }
  
  // ...
}
```

## サーバーサイドエラーハンドラー

### handler/server.ts

#### handleServerAppError

サーバーサイドで発生したエラーを処理し、適切なレスポンスを返却。

```typescript
export const handleServerAppError = (error: unknown): Response => {
  logger.error("handleServerAppError.エラー内容: ", error)
  
  if (error instanceof AppError) {
    // AppError -> そのままレスポンス
    return Response.json(error.toResponse(), { 
      status: error.status 
    })
  }
  
  // 予期しないエラー
  const unknownError = new AppError(
    UNKNOWN_ERROR,
    500,
    'サーバーエラーが発生しました。時間をおいて再度お試しください。',
    ''
  )
  
  return Response.json(unknownError.toResponse(), { 
    status: 500 
  })
}
```

#### 主要機能

1. **エラーログ出力**: サーバーログにエラー内容を記録
2. **AppErrorの変換**: `AppError`を適切なHTTPレスポンスに変換
3. **予期しないエラーハンドリング**: 不明なエラーを500エラーに変換

#### 使用例

```typescript
// app/api/quests/family/route.ts
import { handleServerAppError } from '@/(core)/error/handler/server'
import { AppError } from '@/(core)/error/appError'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // バリデーション
    if (!body.title) {
      throw new AppError(
        'VALIDATION_ERROR',
        400,
        'タイトルは必須です。',
        'title'
      )
    }
    
    // ビジネスロジック
    const result = await createFamilyQuest(body)
    
    return Response.json(result)
  } catch (error) {
    // エラーハンドラーに委譲
    return handleServerAppError(error)
  }
}
```

## エラーハンドリングパターン

### パターン1: API呼び出しエラー

クライアントからAPI呼び出し時のエラー処理。

```typescript
'use client'

import { handleAppError } from '@/(core)/error/handler/client'
import { AppError } from '@/(core)/error/appError'

export async function callApi(url: string, options: RequestInit) {
  const router = useRouter()
  
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw AppError.fromResponse(errorData, response.status)
    }
    
    return await response.json()
  } catch (error) {
    await handleAppError(error as Error, router)
    throw error  // 必要に応じて再スロー
  }
}
```

### パターン2: フォームバリデーションエラー

クライアントサイドバリデーション。

```typescript
'use client'

import { ClientValueError } from '@/(core)/error/appError'

export function validateForm(data: FormData) {
  const title = data.get('title') as string
  const reward = Number(data.get('reward'))
  
  // タイトル検証
  if (!title || title.trim().length === 0) {
    throw new ClientValueError('タイトルを入力してください。', 'title')
  }
  
  if (title.length > 100) {
    throw new ClientValueError('タイトルは100文字以内で入力してください。', 'title')
  }
  
  // 報酬検証
  if (reward < 0) {
    throw new ClientValueError('報酬は0以上の値を入力してください。', 'reward')
  }
  
  if (reward > 10000) {
    throw new ClientValueError('報酬は10000以下の値を入力してください。', 'reward')
  }
}
```

### パターン3: 認証エラー

認証失敗時の処理。

```typescript
'use client'

import { ClientAuthError } from '@/(core)/error/appError'
import { handleAppError } from '@/(core)/error/handler/client'

export async function login(email: string, password: string) {
  const router = useRouter()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      throw new ClientAuthError('メールアドレスまたはパスワードが正しくありません。')
    }
    
    return data
  } catch (error) {
    // handleAppErrorが認証エラーを検知してログイン画面へリダイレクト
    await handleAppError(error as Error, router)
  }
}
```

### パターン4: サーバーサイドデータ検証

サーバーサイドでのビジネスロジック検証。

```typescript
// app/api/quests/family/route.ts
import { AppError } from '@/(core)/error/appError'
import { handleServerAppError } from '@/(core)/error/handler/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 家族の存在チェック
    const family = await db.query.families.findFirst({
      where: eq(families.id, body.familyId),
    })
    
    if (!family) {
      throw new AppError(
        'NOT_FOUND',
        404,
        '指定された家族が見つかりません。',
        'familyId'
      )
    }
    
    // クエスト作成数制限チェック
    const questCount = await db
      .select({ count: count() })
      .from(family_quests)
      .where(eq(family_quests.family_id, body.familyId))
    
    if (questCount[0].count >= 100) {
      throw new AppError(
        'QUOTA_EXCEEDED',
        403,
        'クエスト作成数の上限（100個）に達しました。',
        ''
      )
    }
    
    // クエスト作成
    const result = await createFamilyQuest(body)
    
    return Response.json(result)
  } catch (error) {
    return handleServerAppError(error)
  }
}
```

### パターン5: トランザクションエラー

データベーストランザクション内でのエラー処理。

```typescript
// app/api/quests/family/[id]/child/[childId]/approve/route.ts
import { handleServerAppError } from '@/(core)/error/handler/server'
import { AppError } from '@/(core)/error/appError'

export async function POST(
  request: Request,
  { params }: { params: { id: string; childId: string } }
) {
  try {
    await db.transaction(async (tx) => {
      // 子供クエスト取得
      const childQuest = await tx.query.child_quests.findFirst({
        where: and(
          eq(child_quests.family_quest_id, params.id),
          eq(child_quests.child_id, params.childId)
        ),
      })
      
      if (!childQuest) {
        throw new AppError(
          'NOT_FOUND',
          404,
          '指定されたクエストが見つかりません。',
          ''
        )
      }
      
      // ステータスチェック
      if (childQuest.status !== 'pending_review') {
        throw new AppError(
          'INVALID_STATUS',
          400,
          '承認できない状態です。',
          'status'
        )
      }
      
      // 承認処理
      await tx.update(child_quests)
        .set({ status: 'completed' })
        .where(eq(child_quests.id, childQuest.id))
      
      // 報酬付与
      await tx.update(children)
        .set({ balance: sql`balance + ${childQuest.reward}` })
        .where(eq(children.id, params.childId))
    })
    
    return Response.json({ success: true })
  } catch (error) {
    return handleServerAppError(error)
  }
}
```

## エラーバウンダリー

### ErrorFallback.tsx

React Error Boundaryで予期しないエラーをキャッチ。

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@mantine/core'
import logger from '@/(core)/logger'

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログに記録
    logger.error('ErrorFallback', error)
  }, [error])

  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <Button onClick={reset}>再試行</Button>
    </div>
  )
}
```

#### 使用方法

Next.jsでは`error.tsx`として配置：

```typescript
// app/error.tsx
import ErrorFallback from '@/(core)/error/ErrorFallback'

export default ErrorFallback
```

## グローバルエラーハンドラー

### global-error.tsx

アプリケーション全体のエラーキャッチ。

```typescript
'use client'

import { useEffect } from 'react'
import logger from '@/(core)/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('GlobalError', error)
  }, [error])

  return (
    <html>
      <body>
        <h2>予期しないエラーが発生しました</h2>
        <button onClick={() => reset()}>再試行</button>
      </body>
    </html>
  )
}
```

## エラーハンドリングベストプラクティス

### 1. エラーを早期にキャッチ

```typescript
// ✅ 良い例: バリデーション後すぐにエラーをスロー
if (!email.includes('@')) {
  throw new ClientValueError('有効なメールアドレスを入力してください。', 'email')
}

// ❌ 悪い例: エラーを遅らせる
let emailError = ''
if (!email.includes('@')) {
  emailError = '有効なメールアドレスを入力してください。'
}
// ... 後でエラーを処理
```

### 2. 適切なエラーコードを使用

```typescript
// ✅ 良い例: 意味のあるエラーコード
throw new AppError('QUEST_NOT_FOUND', 404, 'クエストが見つかりません。')

// ❌ 悪い例: 汎用的なエラーコード
throw new AppError('ERROR', 500, 'エラー')
```

### 3. ユーザーフレンドリーなメッセージ

```typescript
// ✅ 良い例: 具体的で理解しやすい
throw new ClientValueError('報酬は0〜10000の範囲で入力してください。', 'reward')

// ❌ 悪い例: 技術的すぎる
throw new ClientValueError('Validation failed: reward out of range', 'reward')
```

### 4. エラーログの活用

```typescript
// ✅ 良い例: コンテキスト付きログ
logger.error('Failed to create quest', {
  familyId,
  title,
  error: error.message,
})

// ❌ 悪い例: 最小限のログ
logger.error(error)
```

### 5. トランザクション内でのエラー処理

```typescript
// ✅ 良い例: トランザクション内でエラーをスロー
await db.transaction(async (tx) => {
  // ...
  if (error) {
    throw new AppError('ERROR_CODE', 400, 'エラーメッセージ')
  }
  // ...
})

// ❌ 悪い例: トランザクション外でエラーを返す
const result = await db.transaction(async (tx) => {
  // ...
  if (error) {
    return { error: 'エラーメッセージ' }  // ロールバックされない
  }
  // ...
})
```
