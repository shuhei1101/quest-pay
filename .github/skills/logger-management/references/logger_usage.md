# Logger 使用方法リファレンス

## 基本的な使い方

### インポート

```typescript
import { logger } from '@/app/(core)/logger'
```

### ログレベル

loglevel は以下のログレベルをサポートしています（優先度順）：

1. **trace** - 最も詳細なデバッグ情報
2. **debug** - デバッグ情報
3. **info** - 一般的な情報（デフォルト）
4. **warn** - 警告
5. **error** - エラー

### 使用例

#### 基本的なログ出力

```typescript
// 情報ログ
logger.info('ユーザーがログインしました', { userId: 123 })

// デバッグログ
logger.debug('API リクエストパラメータ', { params })

// 警告ログ
logger.warn('非推奨のAPI使用', { api: 'oldMethod' })

// エラーログ
logger.error('データベース接続エラー', error)

// トレースログ
logger.trace('関数呼び出し', { functionName: 'processData' })
```

#### フロントエンド（コンポーネント内）

```typescript
'use client'

import { logger } from '@/app/(core)/logger'
import { useEffect } from 'react'

export default function MyComponent() {
  useEffect(() => {
    logger.info('コンポーネントマウント')
    
    return () => {
      logger.debug('コンポーネントアンマウント')
    }
  }, [])
  
  const handleClick = () => {
    try {
      // 処理
      logger.info('ボタンクリック', { action: 'submit' })
    } catch (error) {
      logger.error('処理中にエラー', error)
    }
  }
  
  return <button onClick={handleClick}>送信</button>
}
```

#### バックエンド（API Route）

```typescript
import { logger } from '@/app/(core)/logger'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  logger.info('API リクエスト受信', {
    path: request.nextUrl.pathname,
    method: request.method,
  })
  
  try {
    const data = await fetchData()
    logger.debug('データ取得成功', { count: data.length })
    return Response.json(data)
  } catch (error) {
    logger.error('データ取得エラー', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

#### Server Actions

```typescript
'use server'

import { logger } from '@/app/(core)/logger'

export async function createQuest(formData: FormData) {
  logger.info('クエスト作成開始')
  
  try {
    const result = await db.insert(quests).values({
      title: formData.get('title') as string,
    })
    
    logger.info('クエスト作成成功', { questId: result.id })
    return { success: true, id: result.id }
  } catch (error) {
    logger.error('クエスト作成失敗', error)
    return { success: false, error: 'Failed to create quest' }
  }
}
```

## 環境変数設定

### .env.local

```bash
# 開発環境: デバッグログを表示
NEXT_PUBLIC_LOG_LEVEL=debug

# 本番環境: 情報ログのみ
# NEXT_PUBLIC_LOG_LEVEL=info

# テスト環境: エラーのみ
# NEXT_PUBLIC_LOG_LEVEL=error
```

### ログレベルの動作

設定したレベル以上のログのみが出力されます：

- `trace`: すべてのログを出力
- `debug`: debug, info, warn, error を出力
- `info`: info, warn, error を出力（デフォルト）
- `warn`: warn, error を出力
- `error`: error のみ出力

## ベストプラクティス

### 1. 適切なログレベルを使用

```typescript
// ❌ 悪い例: すべて info
logger.info('デバッグ情報')
logger.info('エラーが発生')

// ✅ 良い例: 適切なレベル
logger.debug('デバッグ情報')
logger.error('エラーが発生')
```

### 2. コンテキスト情報を含める

```typescript
// ❌ 悪い例: 情報不足
logger.error('エラー')

// ✅ 良い例: 詳細な情報
logger.error('クエスト取得エラー', {
  questId: id,
  familyId: familyId,
  error: error.message,
})
```

### 3. 機密情報をログに含めない

```typescript
// ❌ 悪い例: パスワードを含む
logger.debug('ログイン情報', { email, password })

// ✅ 良い例: 機密情報を除外
logger.debug('ログイン試行', { email })
```

### 4. エラーオブジェクトを適切に扱う

```typescript
// ✅ エラーオブジェクトをそのまま渡す
try {
  // 処理
} catch (error) {
  logger.error('処理失敗', error)
}

// または詳細情報と共に
try {
  // 処理
} catch (error) {
  logger.error('処理失敗', {
    operation: 'updateQuest',
    questId: id,
    error: error instanceof Error ? error.message : String(error),
  })
}
```

### 5. パフォーマンス情報のロギング

```typescript
const start = performance.now()

// 処理

const duration = performance.now() - start
logger.debug('処理時間', { operation: 'fetchQuests', duration: `${duration}ms` })
```

## トラブルシューティング

### ログが表示されない

1. 環境変数 `NEXT_PUBLIC_LOG_LEVEL` を確認
2. ブラウザのコンソールフィルターを確認
3. ログレベルが適切か確認（debug を出力するには `NEXT_PUBLIC_LOG_LEVEL=debug`）

### 本番環境でのログ管理

本番環境では `error` または `warn` レベルに設定することを推奨：

```bash
NEXT_PUBLIC_LOG_LEVEL=error
```

### カスタムフォーマッター

より高度なフォーマットが必要な場合は、`logger.ts` の `methodFactory` をカスタマイズ：

```typescript
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName)
  
  return function (...args) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${methodName.toUpperCase()}] [${window.location.pathname}]`
    rawMethod(prefix, ...args)
  }
}
```
