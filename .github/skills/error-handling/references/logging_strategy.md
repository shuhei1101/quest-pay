# Logging Strategy リファレンス
> 2026年3月記載

## 概要

Quest Payアプリケーションにおけるログ戦略と`loglevel`ライブラリの活用方法。

## ロガー設定

### logger.ts

```typescript
// app/(core)/logger.ts
import log from 'loglevel'

const logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL || 'info') as log.LogLevelDesc

log.setLevel(logLevel)

export default log
```

### ログレベル

| レベル | 説明 | 使用場面 | 環境 |
|--------|------|----------|------|
| `debug` | 詳細なデバッグ情報 | 開発中の詳細トレース | 開発 |
| `info` | 一般的な情報ログ | 正常な処理フロー | 開発 |
| `warn` | 警告（処理は継続） | 潜在的な問題 | ステージング |
| `error` | エラー（処理失敗） | 処理失敗、例外 | 本番 |

### 環境別設定

**.env.local**（開発環境）
```bash
NEXT_PUBLIC_LOG_LEVEL=debug
```

**.env.production**（本番環境）
```bash
NEXT_PUBLIC_LOG_LEVEL=error
```

## ログ出力パターン

### 1. デバッグログ (debug)

開発中の詳細情報を記録。

```typescript
import logger from '@/(core)/logger'

// 関数の開始
logger.debug('createFamilyQuest: start', { familyId, title })

// 変数の値
logger.debug('User data:', user)

// 条件分岐
logger.debug('Validation passed')

// ループ内
items.forEach((item, index) => {
  logger.debug(`Processing item ${index}:`, item)
})
```

**使用例**:
```typescript
export async function createFamilyQuest(data: QuestData) {
  logger.debug('createFamilyQuest: start', data)
  
  // バリデーション
  logger.debug('Validating quest data...')
  validateQuestData(data)
  logger.debug('Validation successful')
  
  // DB操作
  logger.debug('Inserting into database...')
  const result = await db.insert(family_quests).values(data)
  logger.debug('Insert result:', result)
  
  logger.debug('createFamilyQuest: end', result)
  return result
}
```

### 2. 情報ログ (info)

正常な処理フローを記録。

```typescript
import logger from '@/(core)/logger'

// 処理の開始・完了
logger.info('Quest created successfully', { questId })

// 重要なイベント
logger.info('User logged in', { userId, email })

// 状態変更
logger.info('Quest status changed', { 
  questId, 
  from: 'in_progress', 
  to: 'completed' 
})
```

**使用例**:
```typescript
export async function approveQuest(questId: string, childId: string) {
  logger.info('Approving quest', { questId, childId })
  
  await db.transaction(async (tx) => {
    // クエスト更新
    await tx.update(child_quests)
      .set({ status: 'completed' })
      .where(eq(child_quests.id, questId))
    
    // 報酬付与
    await tx.update(children)
      .set({ balance: sql`balance + ${reward}` })
      .where(eq(children.id, childId))
    
    logger.info('Quest approved successfully', { 
      questId, 
      childId, 
      reward 
    })
  })
}
```

### 3. 警告ログ (warn)

潜在的な問題を記録（処理は継続）。

```typescript
import logger from '@/(core)/logger'

// 非推奨のAPI使用
logger.warn('Deprecated API called', { api: 'oldMethod' })

// リトライ
logger.warn('Database query failed, retrying...', { attempt: 1 })

// デフォルト値フォールバック
logger.warn('Missing config value, using default', { 
  key: 'MAX_QUESTS',
  default: 100 
})

// パフォーマンス警告
logger.warn('Query took longer than expected', { 
  query: 'getQuests', 
  duration: '5s' 
})
```

**使用例**:
```typescript
export async function fetchData(url: string, maxRetries = 3) {
  let attempt = 0
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      attempt++
      logger.warn('Fetch failed, retrying...', { 
        url, 
        attempt, 
        maxRetries,
        error: error.message 
      })
      
      if (attempt >= maxRetries) {
        throw error
      }
      
      await sleep(1000 * attempt)  // バックオフ
    }
  }
}
```

### 4. エラーログ (error)

処理失敗や例外を記録。

```typescript
import logger from '@/(core)/logger'

// エラーキャッチ
try {
  await createQuest(data)
} catch (error) {
  logger.error('Failed to create quest', { 
    data, 
    error: error.message,
    stack: error.stack 
  })
  throw error
}

// ビジネスロジックエラー
logger.error('Quest approval failed: invalid status', { 
  questId, 
  currentStatus: 'in_progress',
  requiredStatus: 'pending_review' 
})

// システムエラー
logger.error('Database connection failed', { 
  host: dbHost, 
  error: error.message 
})
```

**使用例**:
```typescript
export const handleServerAppError = (error: unknown): Response => {
  logger.error('Server error occurred', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  })
  
  if (error instanceof AppError) {
    return Response.json(error.toResponse(), { status: error.status })
  }
  
  const unknownError = new AppError(
    UNKNOWN_ERROR,
    500,
    'サーバーエラーが発生しました。'
  )
  
  return Response.json(unknownError.toResponse(), { status: 500 })
}
```

## エラーハンドリングとロギング

### クライアントサイド

```typescript
// app/(core)/error/handler/client.ts
import logger from '@/(core)/logger'

export const handleAppError = async (
  error: Error,
  router: AppRouterInstance
) => {
  // エラー内容をログ
  logger.debug('handleAppError: error caught', { 
    name: error.name,
    message: error.message,
    code: error instanceof AppError ? error.code : undefined,
  })
  
  // フィードバックメッセージ設定
  appStorage.feedbackMessage.set({ 
    message: error.message, 
    type: "error" 
  })
  
  // エラーコード別処理
  if (error instanceof AppError) {
    logger.info('Handling AppError', { code: error.code })
    
    switch (error.code) {
      case 'CLIENT_AUTH_ERROR':
        logger.warn('Authentication failed, redirecting to login')
        router.push(LOGIN_URL)
        break
      
      default:
        logger.error('Unhandled error code', { code: error.code })
        router.push(ERROR_URL)
        break
    }
  } else {
    logger.error('Unexpected error', { 
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    router.push(ERROR_URL)
  }
}
```

### サーバーサイド

```typescript
// app/(core)/error/handler/server.ts
import logger from '@/(core)/logger'

export const handleServerAppError = (error: unknown): Response => {
  // エラーをログ
  if (error instanceof AppError) {
    logger.error('AppError occurred', {
      code: error.code,
      status: error.status,
      message: error.message,
      path: error.path,
    })
    
    return Response.json(error.toResponse(), { status: error.status })
  }
  
  // 予期しないエラー
  logger.error('Unexpected server error', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  })
  
  const unknownError = new AppError(
    UNKNOWN_ERROR,
    500,
    'サーバーエラーが発生しました。'
  )
  
  return Response.json(unknownError.toResponse(), { status: 500 })
}
```

## ロギングベストプラクティス

### 1. 構造化ログ

オブジェクトでコンテキストを渡す。

```typescript
// ✅ 良い例: 構造化
logger.info('Quest created', { 
  questId: 'quest-123',
  familyId: 'family-456',
  title: 'クエストタイトル',
  reward: 100,
})

// ❌ 悪い例: 文字列のみ
logger.info('Quest quest-123 created for family family-456')
```

### 2. 機密情報を含めない

パスワード、トークン、個人情報は記録しない。

```typescript
// ✅ 良い例: マスク
logger.info('User logged in', { 
  userId: user.id,
  email: maskEmail(user.email),  // 'abc***@example.com'
})

// ❌ 悪い例: パスワードを含む
logger.debug('Login attempt', { 
  email: user.email,
  password: password,  // 機密情報！
})
```

### 3. 適切なログレベル選択

```typescript
// ✅ 良い例
logger.debug('Entering function', { params })  // 開発中のみ
logger.info('User action completed', { action })  // 正常フロー
logger.warn('Deprecated method used', { method })  // 潜在的問題
logger.error('Operation failed', { error })  // 処理失敗

// ❌ 悪い例
logger.error('Function called')  // エラーでない
logger.debug('Critical system failure')  // 重要度が低すぎる
```

### 4. エラースタックトレース

エラー時はスタックトレースを含める。

```typescript
// ✅ 良い例
try {
  await dangerousOperation()
} catch (error) {
  logger.error('Operation failed', {
    operation: 'dangerousOperation',
    error: error instanceof Error ? error.message : 'Unknown',
    stack: error instanceof Error ? error.stack : undefined,
  })
  throw error
}

// ❌ 悪い例
catch (error) {
  logger.error('Error')  // 情報不足
}
```

### 5. タイミングログ

パフォーマンス測定。

```typescript
// ✅ 良い例
const startTime = Date.now()
logger.debug('Starting operation', { operation: 'fetchQuests' })

await fetchQuests()

const duration = Date.now() - startTime
logger.info('Operation completed', { 
  operation: 'fetchQuests',
  duration: `${duration}ms`,
})

if (duration > 1000) {
  logger.warn('Operation took longer than expected', {
    operation: 'fetchQuests',
    duration: `${duration}ms`,
    threshold: '1000ms',
  })
}
```

## ログフィルタリング

開発中に特定のログのみを表示。

```typescript
// 特定のモジュールのみログ出力
if (process.env.NEXT_PUBLIC_LOG_FILTER === 'quest') {
  logger.debug('Quest operation', data)
}

// レベル別フィルタリング
logger.setLevel('error')  // errorのみ出力
```

## ログの確認方法

### ブラウザコンソール（クライアント）

```javascript
// 開発者ツール > Console
// フィルタリング
// - "error" で error のみ
// - "-warn" で warn 以外
```

### サーバーログ（サーバー）

```bash
# ターミナル
npm run dev

# ログ出力確認
[info] Quest created { questId: 'quest-123' }
[error] Failed to create quest { error: 'Database error' }
```

### 本番環境

- **Vercel**: Vercel Dashboard > Logs
- **Netlify**: Netlify Dashboard > Functions > Logs
- **AWS**: CloudWatch Logs

## トラブルシューティング

### 問題1: ログが出力されない

**原因**: `NEXT_PUBLIC_LOG_LEVEL`が`error`で、`info`や`debug`を出力しようとしている

**解決**:
```bash
# .env.local
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 問題2: 本番環境でログが多すぎる

**原因**: `NEXT_PUBLIC_LOG_LEVEL`が`debug`のまま

**解決**:
```bash
# .env.production
NEXT_PUBLIC_LOG_LEVEL=error
```

### 問題3: エラースタックトレースが表示されない

**原因**: `error.stack`を含めていない

**解決**:
```typescript
logger.error('Error occurred', {
  message: error.message,
  stack: error.stack,  // スタックトレース含める
})
```
