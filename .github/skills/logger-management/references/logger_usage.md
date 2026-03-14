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

**環境別の推奨設定:**
- **開発環境**: `debug` - すべての情報を表示
- **ステージング環境**: `info` - 処理の流れを追跡
- **本番環境（フロントエンド）**: `warn` または `error` のみ
  - ⚠️ **重要**: フロントエンドでは info 以上のログがブラウザコンソールに表示され、**エンドユーザーに見られる**
  - 機密情報、内部実装の詳細は絶対に info 以上で出力しない
- **本番環境（バックエンド）**: `info` 以上でも問題なし（ただしログ量に注意）
  - バックエンド（API）のログはサーバー内に記録され、ユーザーには見えない

**フロントエンド vs バックエンドの違い:**
- **フロントエンド（ブラウザ）**: info 以上のログがブラウザの開発者ツールで **エンドユーザーに見える**
  - 本番環境: warn/error のみ推奨
- **バックエンド（API/サーバー）**: すべてのログはサーバー内に記録、ユーザーには見えない
  - 本番環境: info 以上でも OK（ログ量に注意）

### 2. コンテキスト情報を含める

ログメッセージは**コンテクストがなくても読んで意味がわかる**ようにする。

```typescript
// ❌ 悪い例: 情報不足、意味不明
logger.error('エラー')
logger.info('Transaction failed')
logger.error('java.lang.IndexOutOfBoundsException')

// ✅ 良い例: 詳細な情報、意味が明確
logger.error('クエスト取得エラー', {
  questId: id,
  familyId: familyId,
  error: error.message,
})
logger.info('取引失敗', {
  transactionId: 236432,
  reason: 'クレジットカード番号チェックサムエラー',
})
logger.error('配列範囲外エラー', {
  index: 12,
  collectionSize: 10,
  operation: 'questListAccess',
})
```

**含めるべき情報:**
- 実行されたアクション
- アクションを実行したユーザー（userId）
- 失敗の発生理由
- 修正に関する情報（可能な場合）
- HTTP リクエスト ID（トレーシング用）

### 3. 機密情報をログに含めない

**絶対に記録してはいけない情報:**

```typescript
// ❌ 悪い例: 機密情報を含む
logger.debug('ログイン情報', { email, password }) // パスワード
logger.info('決済情報', { cardNumber, cvv }) // クレジットカード情報
logger.debug('DB接続', { connectionString }) // 接続文字列
logger.info('認証成功', { accessToken }) // アクセストークン
logger.debug('セッション', { sessionId }) // セッションID（そのまま）

// ✅ 良い例: 機密情報を除外またはマスク
logger.debug('ログイン試行', { email }) // emailのみ
logger.info('決済開始', { orderId, amount }) // 決済額とID
logger.debug('DB接続成功', { host, database }) // 接続先のみ
logger.info('認証成功', { userId }) // ユーザーIDのみ
logger.debug('セッション作成', { 
  sessionIdHash: sha256(sessionId) // ハッシュ化
})
```

**除外すべき機密情報リスト:**
- ✗ パスワード
- ✗ クレジットカード番号、CVV
- ✗ 社会保障番号、マイナンバー
- ✗ セッション ID（ハッシュ化を検討）
- ✗ アクセストークン、リフレッシュトークン
- ✗ PII（個人を特定できる情報）- 要確認
- ✗ 暗号化鍵、シークレット
- ✗ データベース接続文字列
- ✗ 銀行口座、支払いカード名義人データ
- ✗ API キー、認証情報
- ✗ アプリケーションのソースコード
- ✗ ユーザーが収集をオプトアウトした情報

**グレーゾーン（要検討）:**
- メールアドレス - 監査目的で必要な場合のみ
- IPアドレス - プライバシーポリシー要確認
- ユーザーエージェント - 通常は問題なし

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
    stack: error instanceof Error ? error.stack : undefined, // デバッグ時のみ
  })
}
```

### 5. 構造化ロギングを使用（JSON形式）

機械でパースしやすく、検索・フィルタリングしやすい形式にする。

```typescript
// ❌ 悪い例: 人間向けの文章だけ
logger.info(`クエスト${questId}をユーザー${userId}が作成しました`)

// ✅ 良い例: 構造化された情報
logger.info('クエスト作成', {
  questId,
  userId,
  title: questTitle,
  timestamp: new Date().toISOString(),
})
```

**構造化ロギングのメリット:**
- 検索が容易（例: 特定のquestIdを含むすべてのログ）
- フィルタリングが容易（例: 特定のuserIdの操作のみ）
- ログ分析ツール（Datadog, CloudWatch等）での解析が容易
- 統計・集計が容易

### 6. 記録すべきイベントを定義する

**必ず記録すべきイベント:**

```typescript
// 1. アプリケーションエラー
logger.error('予期しないエラー', { error, context })

// 2. 認証イベント
logger.info('ログイン成功', { userId, email })
logger.warn('ログイン失敗', { email, reason: 'パスワード不一致' })
logger.warn('アカウントロック', { userId, failedAttempts: 5 })

// 3. 承認の失敗
logger.warn('権限エラー', { userId, resource: 'quest', action: 'delete' })

// 4. 重要なデータ変更（監査目的）
logger.info('クエスト削除', { questId, deletedBy: userId })
logger.info('報酬支払い', { childId, amount, questId })

// 5. セッション管理
logger.info('セッション作成', { userId, sessionIdHash })
logger.info('セッション期限切れ', { userId })

// 6. データのインポート/エクスポート
logger.info('データエクスポート開始', { userId, dataType: 'quests' })
logger.info('データエクスポート完了', { userId, recordCount: 150 })
```

**監査目的のログ:**
- ユーザーがプロファイルを更新したとき
- 重要な設定変更
- データの削除・変更
- 権限の変更

### 7. パフォーマンス情報のロギング

```typescript
// 処理時間の計測
const start = performance.now()

try {
  const quests = await fetchQuests(familyId)
  const duration = performance.now() - start
  
  logger.info('クエスト取得完了', {
    familyId,
    count: quests.length,
    duration: `${duration.toFixed(2)}ms`,
  })
  
  // パフォーマンス警告
  if (duration > 1000) {
    logger.warn('クエスト取得が遅い', {
      familyId,
      duration: `${duration.toFixed(2)}ms`,
      threshold: '1000ms',
    })
  }
  
} catch (error) {
  const duration = performance.now() - start
  logger.error('クエスト取得エラー', {
    familyId,
    duration: `${duration.toFixed(2)}ms`,
    error,
  })
}
```

**プロファイリング目的:**
- データベースクエリの実行時間
- API呼び出しの応答時間
- 重い処理の実行時間

**統計目的:**
- 特定のイベント発生回数（エラー率等）
- ユーザー行動の分析
- アラート条件の検出（連続エラー等）

### 8. 適切なログ量を維持する

**過剰なログの問題:**
- パフォーマンス影響（特にループ内）
- ストレージコスト増加
- 重要なログが埋もれる
- ログ処理コスト増加

```typescript
// ❌ 悪い例: 過剰なログ
for (const quest of quests) {
  logger.debug('クエスト処理中', { questId: quest.id }) // 100件なら100回ログ
  processQuest(quest)
}

// ✅ 良い例: サマリーログ
logger.debug('クエスト一括処理開始', { count: quests.length })
const results = quests.map(processQuest)
logger.debug('クエスト一括処理完了', { 
  count: quests.length,
  succeeded: results.filter(r => r.success).length,
})
```

**HTTP ステータスコードのログ:**
- 200/300 レベル（成功・リダイレクト）: ログ不要または debug レベル
- 400 レベル（クライアントエラー）: warn レベル
- 500 レベル（サーバーエラー）: error レベル

### 9. 誰がログを読むかを考える

ログの読者によって必要な情報が異なる：

**エンドユーザー向け（クライアントアプリ）:**
- error レベルのみ表示
- ユーザーフレンドリーなメッセージ
- 技術的詳細は非表示

**運用エンジニア向け（本番環境）:**
- info/warn/error レベル
- システムの動作状況がわかる
- トラブルシューティングに必要な情報

**開発者向け（開発環境）:**
- debug/trace レベルを含むすべて
- 詳細なデバッグ情報
- スタックトレース

```typescript
// 環境に応じたログレベル設定
if (process.env.NODE_ENV === 'production') {
  logger.setLevel('warn') // 本番: 警告とエラーのみ
} else if (process.env.NODE_ENV === 'staging') {
  logger.setLevel('info') // ステージング: 情報以上
} else {
  logger.setLevel('debug') // 開発: すべて
}
```

### 10. ログの用途を理解する

ログはトラブルシューティングだけでなく、様々な用途がある：

**1. トラブルシューティング**
```typescript
logger.error('クエスト作成失敗', { questData, error })
```

**2. 監査（Audit）**
```typescript
logger.info('重要データ変更', {
  action: 'quest.delete',
  performedBy: userId,
  targetId: questId,
  timestamp: new Date().toISOString(),
})
```

**3. プロファイリング**
```typescript
logger.debug('処理時間計測', {
  operation: 'fetchQuests',
  duration: '245ms',
  recordCount: 50,
})
```

**4. 統計・アラート**
```typescript
logger.warn('API呼び出し失敗', { endpoint, statusCode: 500 })
// → 連続失敗でアラート発火
```

**5. ユーザー行動分析**
```typescript
logger.info('機能使用', {
  feature: 'quest.filter',
  userId,
  filterType: 'byStatus',
})
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
