# ログ配置ガイド - デバッグに効果的なログ戦略

## ログ配置の基本原則

### 1. 処理の流れを追跡できる

デバッグ時に「どこまで実行されたか」「どの分岐に入ったか」が分かるようにする。

### 2. 問題発生時の情報が十分にある

エラー発生時に、原因特定に必要な情報（ID、パラメータ、状態）を含める。

### 3. コンテクストがなくても意味がわかる

ログメッセージ単体で読んでも、何が起きたかを理解できるようにする。

### 4. パフォーマンス影響を最小限に

本番環境で不要なログは debug/trace レベルにして、環境変数で制御できるようにする。

**注意:** 過剰なログはパフォーマンスに悪影響を及ぼし、ログストレージと処理コストも増加する。

### 5. ノイズを避ける

ループ内の過度なログ、既知の正常系の詳細ログは避ける。

### 6. 検索しやすい構造化形式を使う

JSON等の構造化フォーマットで、特定のIDやパラメータで検索できるようにする。

---

## 記録すべきイベントの定義

アプリがどのように動作するかを物語るイベントをログに記録する。

### 必ず記録すべきイベント

#### 1. セキュリティ関連イベント

```typescript
// 認証の成功と失敗
logger.info('ログイン成功', { userId, email, timestamp })
logger.warn('ログイン失敗', { email, reason: 'パスワード不一致', attemptCount: 3 })
logger.warn('アカウントロック', { userId, reason: '失敗試行回数超過' })

// 承認の失敗
logger.warn('権限エラー', { 
  userId, 
  resource: 'quest', 
  action: 'delete',
  requiredRole: 'parent',
  currentRole: 'child',
})

// セッション管理の失敗
logger.warn('セッション期限切れ', { userId, sessionIdHash })
logger.error('セッションハイジャック疑い', { userId, suspiciousIP })

// 特権の昇格（成功と失敗）
logger.info('管理者権限付与', { 
  targetUserId, 
  grantedBy: adminUserId,
  role: 'admin',
})
logger.warn('管理者権限付与失敗', { 
  targetUserId, 
  attemptedBy: userId,
  reason: '権限不足',
})
```

#### 2. データ変更イベント（監査目的）

```typescript
// 重要なデータの作成・更新・削除
logger.info('クエスト作成', { 
  questId, 
  createdBy: userId, 
  title,
  timestamp,
})

logger.info('クエスト削除', { 
  questId, 
  deletedBy: userId, 
  reason,
  timestamp,
})

logger.info('報酬支払い', { 
  childId, 
  questId, 
  amount, 
  paidBy: userId,
  timestamp,
})

// プロフィール更新
logger.info('ユーザープロフィール更新', { 
  userId, 
  updatedFields: ['email', 'displayName'],
  timestamp,
})
```

#### 3. リスクの高いイベント

```typescript
// データのインポート/エクスポート
logger.info('データエクスポート開始', { 
  userId, 
  dataType: 'quests',
  format: 'csv',
})
logger.info('データエクスポート完了', { 
  userId, 
  dataType: 'quests',
  recordCount: 150,
  fileSize: '2.5MB',
})

// 一括削除
logger.warn('一括削除実行', { 
  userId, 
  resourceType: 'quests',
  deletedCount: 50,
})

// 設定変更
logger.info('重要設定変更', { 
  userId, 
  setting: 'familyVisibility',
  oldValue: 'private',
  newValue: 'public',
})
```

#### 4. アプリケーションエラー

```typescript
// 予期しないエラー
logger.error('予期しないエラー', { 
  error: error.message,
  stack: error.stack,
  context: { userId, questId },
})

// 入力検証の失敗
logger.warn('入力検証失敗', { 
  field: 'questTitle',
  value: providedValue,
  reason: '文字数超過',
  maxLength: 100,
})

// 出力検証の失敗
logger.error('データ整合性エラー', { 
  questId,
  expectedStatus: 'active',
  actualStatus: null,
  operation: 'questCompletion',
})
```

### その他の有用なイベント

#### トラブルシューティング用

```typescript
logger.debug('API呼び出し開始', { endpoint, params })
logger.debug('データベースクエリ実行', { query, params })
```

#### 監視とパフォーマンス向上

```typescript
logger.warn('レスポンス時間超過', { 
  endpoint: '/api/quests',
  duration: '2500ms',
  threshold: '1000ms',
})

logger.info('キャッシュヒット率低下', { 
  hitRate: 0.45,
  threshold: 0.8,
})
```

#### ユーザー行動の理解

```typescript
logger.info('機能使用', { 
  feature: 'questFilter',
  userId,
  filterType: 'byStatus',
})

logger.info('オプトイン', { 
  userId,
  agreement: 'termsOfService',
  version: '2.0',
})
```

---

## 機密情報の除外ガイド

セキュリティとコンプライアンスの要件を常に念頭に置く。

### 絶対に記録してはいけない情報

#### 認証・認可情報
```typescript
// ❌ 絶対にダメ
logger.debug('ログイン処理', { email, password })
logger.info('API呼び出し', { apiKey, accessToken })
logger.debug('DB接続', { connectionString })

// ✅ OK
logger.debug('ログイン処理', { email })
logger.info('API呼び出し', { endpoint, userId })
logger.debug('DB接続成功', { host, database, user })
```

除外リスト：
- ✘ パスワード
- ✘ API キー
- ✘ アクセストークン、リフレッシュトークン
- ✘ 認証トークン全般
- ✘ 暗号化キー、シークレット
- ✘ データベース接続文字列（パスワード含む）
- ✘ JWT トークン（ペイロードも含む）

#### 決済・金融情報
```typescript
// ❌ 絶対にダメ
logger.info('決済処理', { 
  cardNumber: '1234-5678-9012-3456',
  cvv: '123',
  expiryDate: '12/25',
})

// ✅ OK
logger.info('決済処理', { 
  orderId,
  amount,
  cardLast4: '3456', // 下4桁のみ
  cardType: 'Visa',
})
```

除外リスト：
- ✘ クレジットカード番号（全体）
- ✘ CVV/CVCコード
- ✘ 銀行口座番号
- ✘ 支払いカード名義人情報
- ✘ 暗証番号（PIN）

#### 個人を特定できる情報（PII）
```typescript
// ❌ 要注意
logger.info('ユーザー登録', { 
  email, // プライバシーポリシー要確認
  phoneNumber, // PII
  address, // PII
  socialSecurityNumber, // 絶対NG
})

// ✅ OK
logger.info('ユーザー登録', { 
  userId, // 匿名化されたID
  emailDomain: email.split('@')[1], // ドメインのみ
  country, // 地域レベルならOK
})
```

除外リスト：
- ✘ 社会保障番号、マイナンバー
- ✘ パスポート番号、運転免許証番号
- ✘ 生年月日（フル）
- ✘ 住所（詳細）
- ✘ 電話番号（フル）
- △ メールアドレス（監査目的でのみ許可される場合あり）
- △ 氏名（監査目的でのみ許可される場合あり）

#### セッション情報
```typescript
// ❌ セッションIDをそのまま記録
logger.debug('セッション作成', { sessionId: 'abc123xyz' })

// ✅ ハッシュ化して記録
import crypto from 'crypto'

const sessionIdHash = crypto
  .createHash('sha256')
  .update(sessionId)
  .digest('hex')
  .substring(0, 16)

logger.debug('セッション作成', { sessionIdHash })
```

セッションIDはイベント追跡に必要な場合があるが、そのままの記録は避け、ハッシュ化する。

#### アプリケーション機密情報
```typescript
// ❌ 絶対にダメ
logger.debug('設定', { 
  config: {
    dbPassword: process.env.DB_PASSWORD,
    apiSecret: process.env.API_SECRET,
  },
})

// ✅ OK
logger.debug('設定読み込み完了', { 
  configKeys: Object.keys(config),
  environment: process.env.NODE_ENV,
})
```

除外リスト：
- ✘ 環境変数の値（特にシークレット）
- ✘ アプリケーションのソースコード
- ✘ 内部システムのIPアドレス、ホスト名（セキュリティリスク）
- ✘ 暗号化されていないバックアップファイルのパス

### 記録時のマスキング手法

#### 部分マスキング
```typescript
// クレジットカード番号の一部のみ表示
const cardLast4 = cardNumber.slice(-4)
logger.info('決済処理', { cardLast4, amount })

// メールアドレスのドメインのみ
const emailDomain = email.split('@')[1]
logger.info('ユーザー登録', { emailDomain, userId })
```

#### ハッシュ化
```typescript
import crypto from 'crypto'

function hashSensitiveData(data: string): string {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .substring(0, 16) // 短縮版
}

logger.info('セッション作成', { 
  userIdHash: hashSensitiveData(userId),
  sessionIdHash: hashSensitiveData(sessionId),
})
```

### コンプライアンスチェックリスト

ログ記録前に確認：

- [ ] 企業のプライバシーポリシーに準拠しているか
- [ ] GDPR、CCPA等の規制に違反していないか
- [ ] ログの保存場所が適切か（地域要件）
- [ ] ログの保持期間が適切か
- [ ] ユーザーがオプトアウトした情報を含めていないか
- [ ] 収集への同意が失効していない情報か
- [ ] ログシステムのセキュリティレベルが適切か

---

## ログの用途と設計

ログはトラブルシューティングだけでなく、様々な用途がある。

### 1. トラブルシューティング

**目的:** 問題発生時の原因特定

```typescript
// エラー発生時の詳細情報
logger.error('クエスト作成失敗', {
  error: error.message,
  stack: error.stack,
  input: questData,
  userId,
  timestamp,
})
```

**設計ポイント:**
- エラー時に必要なコンテキストを全て含める
- スタックトレースを含める（開発・ステージング環境）
- 再現に必要な入力データを記録

### 2. 監査（Audit）

**目的:** 誰が・いつ・何を・変更したかの記録

```typescript
// 重要なデータ変更
logger.info('監査ログ: クエスト削除', {
  action: 'quest.delete',
  performedBy: userId,
  performedByRole: userRole,
  targetResource: 'quest',
  targetId: questId,
  timestamp: new Date().toISOString(),
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
})
```

**設計ポイント:**
- 監査ログは info レベル以上（本番環境でも記録）
- Who（誰が）、When（いつ）、What（何を）、How（どのように）を明確に
- 法的要件を満たす保持期間を設定
- 改ざん防止策（追記専用ログ等）

### 3. パフォーマンスプロファイリング

**目的:** ボトルネック特定、パフォーマンス監視

```typescript
// 処理時間の計測
const startTime = performance.now()

try {
  const quests = await fetchQuests(familyId)
  const duration = performance.now() - startTime
  
  logger.info('パフォーマンス計測', {
    operation: 'fetchQuests',
    duration: `${duration.toFixed(2)}ms`,
    recordCount: quests.length,
    familyId,
  })
  
  // 閾値超過時は警告
  if (duration > 1000) {
    logger.warn('パフォーマンス劣化検出', {
      operation: 'fetchQuests',
      duration: `${duration.toFixed(2)}ms`,
      threshold: '1000ms',
      recordCount: quests.length,
    })
  }
  
} catch (error) {
  const duration = performance.now() - startTime
  logger.error('クエスト取得エラー', {
    operation: 'fetchQuests',
    duration: `${duration.toFixed(2)}ms`,
    familyId,
    error,
  })
}
```

**設計ポイント:**
- 開始時刻と終了時刻を記録
- 処理件数を記録（データ量との相関を分析）
- 閾値を超えた場合は warn/error レベルで記録

### 4. 統計とアラート

**目的:** エラー率、使用パターンの監視、異常検知

```typescript
// エラー発生をカウントできる形式で記録
logger.error('API呼び出し失敗', {
  endpoint: '/api/quests',
  statusCode: 500,
  errorType: 'DatabaseConnectionError',
  timestamp: new Date().toISOString(),
})

// 特定イベントの発生を記録
logger.info('機能使用統計', {
  feature: 'questCreation',
  userId,
  timestamp: new Date().toISOString(),
})
```

**統計取得例:**
- エラー率: error レベルのログ数 / 全リクエスト数
- 機能使用頻度: 特定 feature の info ログ数
- レスポンス時間: duration フィールドの平均・P95/P99

**アラート設定例:**
```typescript
// 1分間に同じエラーが10回以上発生 → アラート
if (errorCount > 10) {
  logger.error('アラート: エラー多発', {
    errorType: 'DatabaseConnectionError',
    count: errorCount,
    timeWindow: '1分',
  })
}
```

### 5. ユーザー行動分析

**目的:** 機能の使用状況、ユーザー体験の改善

```typescript
// 機能使用の記録
logger.info('ユーザー行動', {
  action: 'filterQuests',
  userId,
  filterType: 'byStatus',
  selectedStatus: 'active',
  resultCount: 15,
})

logger.info('ユーザー行動', {
  action: 'questView',
  userId,
  questId,
  viewDuration: '45s',
})
```

**設計ポイント:**
- PII（個人を特定できる情報）に注意
- ユーザーのオプトアウト設定を尊重
- プライバシーポリシーに準拠

### 6. セキュリティ監視

**目的:** 不正アクセス、攻撃の検出

```typescript
// 不審なアクティビティの検出
logger.warn('セキュリティ警告: 短時間の大量リクエスト', {
  userId,
  ipAddress,
  requestCount: 100,
  timeWindow: '1分',
})

logger.warn('セキュリティ警告: 異なるIPからの同時ログイン', {
  userId,
  ip1: requestIP,
  ip2: sessionIP,
})
```

---

## フロントエンド vs バックエンドの特別な考慮事項

### ⚠️ フロントエンド（ブラウザ）の重要な注意点

**フロントエンドでは info 以上のログがブラウザコンソールに表示され、エンドユーザーに見られます。**

#### フロントエンド（ブラウザ）でのログ制約

```typescript
// ❌ 危険: 本番フロントエンドで info 以上に機密情報を出力
logger.info('ユーザー情報取得', { userId, email, sessionToken }) // ブラウザコンソールで見える！

// ✅ 安全: debug レベルなら本番では非表示
logger.debug('ユーザー情報取得', { userId }) // 本番では出力されない

// ✅ 安全: 本番フロントエンドでは warn/error のみ
logger.warn('API接続失敗、リトライ中')
logger.error('致命的エラー: データ取得失敗')
```

**フロントエンドの推奨事項:**
- 本番環境: `NEXT_PUBLIC_LOG_LEVEL=warn` または `error`
- 機密情報、内部実装の詳細は debug レベルで
- エンドユーザー向けのフレンドリーなメッセージのみ info 以上で

#### バックエンド（API/サーバー）でのログ

**バックエンドのログはサーバー内に記録され、エンドユーザーには見えません。**

```typescript
// ✅ バックエンドでは info 以上でも問題なし
export async function GET(request: NextRequest) {
  logger.info('API呼び出し', { endpoint: '/api/quests', userId })
  // サーバーログなのでユーザーには見えない
}
```

**バックエンドの推奨事項:**
- 本番環境: `LOG_LEVEL=info` 以上（トラブルシューティングに有用）
- ログ量とパフォーマンスに注意（過剰なログは避ける）
- 監査ログ、セキュリティイベントは必ず記録

### まとめ: フロントエンド vs バックエンド

| 項目 | フロントエンド（ブラウザ） | バックエンド（API/サーバー） |
|------|-------------------------|-------------------------|
| **可視性** | エンドユーザーに見える | サーバー内のみ |
| **本番推奨レベル** | warn/error のみ | info 以上 OK |
| **機密情報** | 絶対に info 以上で出力しない | 記録可（除外ガイドに従う） |
| **内部実装の詳細** | debug レベルのみ | info 以上でも可 |
| **デバッグ情報** | debug レベルのみ | 必要に応じて info/debug |

---

## 誰がログを読むかを考える

ログの読者によって必要な情報とログレベルが異なる。

### 1. エンドユーザー向け（クライアントアプリ）

**対象:** アプリ使用中のユーザー

**ログレベル:** error のみ

**内容:**
- ユーザーフレンドリーなエラーメッセージ
- 技術的詳細は非表示
- 次にすべきアクション（リトライ、サポート連絡等）

```typescript
// ❌ ユーザーには見せない
logger.error('IndexOutOfBoundsException at line 342')

// ✅ ユーザーフレンドリー
logger.error('データの読み込みに失敗しました。もう一度お試しください。')
```

### 2. システム管理者・運用エンジニア向け

**対象:** 本番環境の監視・トラブルシューティング担当

**ログレベル:** info, warn, error

**内容:**
- システムの動作状況（正常/異常）
- リソース使用状況
- パフォーマンス情報
- エラー発生箇所と影響範囲

```typescript
// システムの健全性を示すログ
logger.info('定期ヘルスチェック', {
  status: 'healthy',
  dbConnectionPool: '8/10',
  memoryUsage: '65%',
  activeRequests: 23,
})

logger.warn('リソース警告', {
  resource: 'dbConnectionPool',
  usage: '9/10',
  threshold: '80%',
})

logger.error('サービス停止', {
  service: 'questNotificationService',
  reason: 'messageQueueConnectionLost',
  affectedUsers: 150,
})
```

### 3. 開発者向け（開発・デバッグ）

**対象:** 機能開発・バグ修正担当

**ログレベル:** すべて（trace, debug, info, warn, error）

**内容:**
- 関数の入出力
- 条件分岐の詳細
- データベースクエリの内容
- スタックトレース
- 変数の値

```typescript
// 開発時のデバッグログ
logger.debug('関数呼び出し', {
  function: 'processQuestCompletion',
  input: { questId, childId },
})

logger.trace('条件分岐', {
  condition: 'quest.status === "completed"',
  result: false,
  questStatus: quest.status,
})

logger.debug('データベースクエリ', {
  table: 'quests',
  operation: 'select',
  where: { familyId, status: 'active' },
  resultCount: 15,
})
```

### ログレベルと読者のマトリックス

| 読者 | trace | debug | info | warn | error | 環境 |
|------|-------|-------|------|------|-------|------|
| エンドユーザー | - | - | - | - | ✓ | 本番 |
| 運用エンジニア | - | - | ✓ | ✓ | ✓ | 本番 |
| 開発者 | ✓ | ✓ | ✓ | ✓ | ✓ | 開発 |
| QA担当 | - | ✓ | ✓ | ✓ | ✓ | ステージング |

### 環境別ログレベル設定の推奨

```typescript
// 環境変数によるログレベル制御
const logLevelByEnv = {
  production: 'warn',        // 本番: 警告とエラーのみ
  staging: 'info',           // ステージング: 情報以上
  development: 'debug',      // 開発: デバッグ以上
  test: 'error',             // テスト: エラーのみ
}

logger.setLevel(logLevelByEnv[process.env.NODE_ENV] || 'info')
```

---

## 配置パターン別ガイド

### パターン1: API Route / Server Actions

**目的**: リクエストの開始・終了・エラーを追跡

```typescript
// ✅ 推奨パターン
import { logger } from '@/app/(core)/logger'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const familyId = searchParams.get('familyId')
  
  // 1. エントリーポイント: リクエスト受信をログ
  logger.info('クエスト一覧取得API開始', {
    familyId,
    path: request.nextUrl.pathname,
  })
  
  try {
    // 2. DB操作前: クエリパラメータをログ（debug）
    logger.debug('クエスト検索条件', { familyId, status: 'active' })
    
    const quests = await db.query.quests.findMany({
      where: eq(quests.familyId, familyId),
    })
    
    // 3. 正常終了: 結果サマリをログ（debug）
    logger.debug('クエスト一覧取得成功', { count: quests.length })
    
    return Response.json(quests)
    
  } catch (error) {
    // 4. エラー発生: 詳細情報をログ（error）
    logger.error('クエスト一覧取得エラー', {
      familyId,
      error: error instanceof Error ? error.message : String(error),
    })
    
    return Response.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    )
  }
}
```

**配置場所:**
- ✅ 関数の最初（info）
- ✅ DB操作の前後（debug）
- ✅ catch ブロック（error）
- ✅ 正常終了時（debug）

---

### パターン2: データベース操作（複雑なクエリ）

**目的**: クエリの実行状況とデータの流れを追跡

```typescript
export async function updateQuestStatus(
  questId: string,
  newStatus: string,
  userId: string
) {
  logger.info('クエストステータス更新開始', { questId, newStatus, userId })
  
  try {
    // トランザクション開始
    await db.transaction(async (tx) => {
      // 1. 更新前の状態を取得
      logger.debug('クエスト現在状態取得', { questId })
      
      const [quest] = await tx
        .select()
        .from(quests)
        .where(eq(quests.id, questId))
        .for('update')
      
      if (!quest) {
        logger.warn('クエストが見つかりません', { questId })
        throw new Error('Quest not found')
      }
      
      logger.debug('クエスト現在状態', {
        questId,
        currentStatus: quest.status,
        newStatus,
      })
      
      // 2. ステータス更新
      await tx
        .update(quests)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(quests.id, questId))
      
      // 3. 履歴レコード作成
      logger.debug('ステータス変更履歴作成', { questId, userId })
      
      await tx.insert(questStatusHistory).values({
        questId,
        oldStatus: quest.status,
        newStatus,
        changedBy: userId,
        changedAt: new Date(),
      })
      
      logger.info('クエストステータス更新完了', {
        questId,
        oldStatus: quest.status,
        newStatus,
      })
    })
    
    return { success: true }
    
  } catch (error) {
    logger.error('クエストステータス更新エラー', {
      questId,
      newStatus,
      userId,
      error: error instanceof Error ? error.message : String(error),
    })
    
    return { success: false, error: 'Failed to update quest status' }
  }
}
```

**配置場所:**
- ✅ トランザクション開始時（info）
- ✅ 重要なクエリの前（debug）
- ✅ データ取得後の状態確認（debug）
- ✅ トランザクション完了時（info）
- ✅ エラー時（error）

---

### パターン3: フロントエンド（コンポーネント）

**目的**: ユーザー操作とデータフローを追跡

```typescript
'use client'

import { logger } from '@/app/(core)/logger'
import { useEffect, useState } from 'react'

export default function QuestEditForm({ questId }: { questId: string }) {
  const [quest, setQuest] = useState<Quest | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 1. コンポーネントマウント時
    logger.debug('クエスト編集画面マウント', { questId })
    
    const fetchQuest = async () => {
      try {
        logger.debug('クエストデータ取得開始', { questId })
        
        const response = await fetch(`/api/quests/${questId}`)
        
        if (!response.ok) {
          logger.warn('クエストデータ取得失敗', {
            questId,
            status: response.status,
          })
          throw new Error('Failed to fetch quest')
        }
        
        const data = await response.json()
        
        logger.debug('クエストデータ取得成功', {
          questId,
          title: data.title,
        })
        
        setQuest(data)
        
      } catch (error) {
        logger.error('クエストデータ取得エラー', {
          questId,
          error: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuest()
    
    // クリーンアップ時
    return () => {
      logger.debug('クエスト編集画面アンマウント', { questId })
    }
  }, [questId])
  
  const handleSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string
    
    // 2. ユーザー操作のログ
    logger.info('クエスト更新開始', { questId, title })
    
    try {
      const response = await fetch(`/api/quests/${questId}`, {
        method: 'PUT',
        body: JSON.stringify({ title }),
      })
      
      if (!response.ok) {
        logger.warn('クエスト更新失敗', {
          questId,
          status: response.status,
        })
        throw new Error('Failed to update quest')
      }
      
      logger.info('クエスト更新成功', { questId })
      
      // 成功通知など
      
    } catch (error) {
      logger.error('クエスト更新エラー', {
        questId,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
  
  if (loading) return <div>Loading...</div>
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(new FormData(e.currentTarget))
    }}>
      {/* フォーム内容 */}
    </form>
  )
}
```

**配置場所:**
- ✅ useEffect（マウント時）- debug
- ✅ データ取得開始・完了 - debug
- ✅ ユーザー操作（送信等）- info
- ✅ API呼び出しエラー - error
- ✅ クリーンアップ（必要なら）- debug

---

### パターン4: 条件分岐（重要なビジネスロジック）

**目的**: どの分岐に入ったかを追跡

```typescript
export async function processQuestCompletion(
  questId: string,
  childId: string
) {
  logger.info('クエスト完了処理開始', { questId, childId })
  
  try {
    const quest = await getQuest(questId)
    
    // 1. 重要な条件分岐
    if (quest.status === 'completed') {
      logger.warn('既に完了済みのクエスト', { questId, status: quest.status })
      return { success: false, message: 'Quest already completed' }
    }
    
    if (quest.assignedChildId !== childId) {
      logger.warn('担当者不一致', {
        questId,
        assignedChildId: quest.assignedChildId,
        requestChildId: childId,
      })
      return { success: false, message: 'Not assigned to this child' }
    }
    
    // 2. 報酬計算の分岐
    let reward = quest.baseReward
    
    if (quest.completedAt && isWithinDeadline(quest.completedAt, quest.deadline)) {
      logger.debug('期限内完了ボーナス適用', {
        questId,
        baseReward: quest.baseReward,
        bonus: quest.timeBonus,
      })
      reward += quest.timeBonus
    } else {
      logger.debug('通常報酬のみ', { questId, reward })
    }
    
    // 3. 実績解除チェック
    const achievementUnlocked = await checkAchievements(childId, questId)
    
    if (achievementUnlocked) {
      logger.info('実績解除', {
        questId,
        childId,
        achievement: achievementUnlocked.name,
      })
      reward += achievementUnlocked.bonus
    }
    
    logger.info('クエスト完了処理成功', {
      questId,
      childId,
      totalReward: reward,
    })
    
    return { success: true, reward }
    
  } catch (error) {
    logger.error('クエスト完了処理エラー', {
      questId,
      childId,
      error: error instanceof Error ? error.message : String(error),
    })
    
    return { success: false, error: 'Failed to process quest completion' }
  }
}
```

**配置場所:**
- ✅ 重要な条件チェック（warn）
- ✅ ビジネスロジックの分岐（debug）
- ✅ 特別なイベント（実績解除等）（info）

---

### パターン5: 非同期処理・Promise チェーン

**目的**: 非同期処理の流れを追跡

```typescript
export async function createQuestWithNotifications(
  questData: QuestInput,
  familyId: string
) {
  logger.info('クエスト作成・通知処理開始', {
    familyId,
    title: questData.title,
  })
  
  try {
    // 1. クエスト作成
    logger.debug('クエストDB登録開始', { familyId })
    
    const [newQuest] = await db
      .insert(quests)
      .values({
        ...questData,
        familyId,
        createdAt: new Date(),
      })
      .returning()
    
    logger.info('クエストDB登録完了', {
      questId: newQuest.id,
      title: newQuest.title,
    })
    
    // 2. 通知送信（非同期・並列）
    logger.debug('通知送信開始', { questId: newQuest.id })
    
    const notificationPromises = [
      sendEmailNotification(familyId, newQuest),
      sendPushNotification(familyId, newQuest),
      createTimelineEntry(familyId, newQuest),
    ]
    
    const results = await Promise.allSettled(notificationPromises)
    
    // 3. 結果ログ
    results.forEach((result, index) => {
      const notificationType = ['email', 'push', 'timeline'][index]
      
      if (result.status === 'fulfilled') {
        logger.debug('通知送信成功', {
          type: notificationType,
          questId: newQuest.id,
        })
      } else {
        logger.warn('通知送信失敗', {
          type: notificationType,
          questId: newQuest.id,
          error: result.reason,
        })
      }
    })
    
    logger.info('クエスト作成・通知処理完了', {
      questId: newQuest.id,
      notificationsSent: results.filter((r) => r.status === 'fulfilled').length,
    })
    
    return { success: true, quest: newQuest }
    
  } catch (error) {
    logger.error('クエスト作成・通知処理エラー', {
      familyId,
      error: error instanceof Error ? error.message : String(error),
    })
    
    return { success: false, error: 'Failed to create quest' }
  }
}
```

**配置場所:**
- ✅ 非同期処理の開始・完了（debug/info）
- ✅ Promise.allSettled の各結果（debug/warn）

---

## 避けるべきパターン

### ❌ ループ内の過度なログ

```typescript
// ❌ 悪い例
quests.forEach((quest) => {
  logger.debug('クエスト処理中', { questId: quest.id }) // ノイズ
  processQuest(quest)
})

// ✅ 良い例
logger.debug('クエスト一括処理開始', { count: quests.length })
quests.forEach((quest) => {
  processQuest(quest)
})
logger.debug('クエスト一括処理完了', { count: quests.length })
```

### ❌ 機密情報のログ出力

```typescript
// ❌ 悪い例
logger.debug('ログイン処理', { email, password }) // パスワードをログに含めない

// ✅ 良い例
logger.debug('ログイン処理', { email })
```

### ❌ 冗長なログ

```typescript
// ❌ 悪い例
logger.info('クエスト取得開始')
const quest = await getQuest(id)
logger.info('クエスト取得完了')
logger.info('クエスト検証開始')
validateQuest(quest)
logger.info('クエスト検証完了')
// ... 処理が細かすぎる

// ✅ 良い例
logger.info('クエスト処理開始', { questId: id })
const quest = await getQuest(id)
validateQuest(quest)
logger.info('クエスト処理完了', { questId: id })
```

### ❌ HTTPステータスコードの過剰なログ

**問題:** 200/300レベル（成功・リダイレクト）のステータスコードをすべてログすると、大量のログデータが生成され、パフォーマンスとコストに影響する。

```typescript
// ❌ 悪い例: すべてのHTTPレスポンスをログ
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    logger.info('HTTPレスポンス', { statusCode: 200 }) // 不要
    return Response.json(data)
  } catch (error) {
    logger.error('HTTPレスポンス', { statusCode: 500 })
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ 良い例: 400/500レベルのみをログ
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    // 200レスポンスはログしない（またはdebugレベル）
    logger.debug('データ取得成功', { count: data.length })
    return Response.json(data)
  } catch (error) {
    // 500レベルはerrorログ
    logger.error('サーバーエラー', { 
      statusCode: 500, 
      error: error.message,
    })
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

**HTTPステータスコード別ロギング推奨レベル:**

| ステータス範囲 | 意味 | ログレベル | 理由 |
|----------------|------|------------|------|
| 200-299 | 成功 | なし または `debug` | 正常系、頻度が高い |
| 300-399 | リダイレクト | なし または `debug` | 正常系、頻度が高い |
| 400-499 | クライアントエラー | `warn` | ユーザー入力エラー、監視が必要 |
| 500-599 | サーバーエラー | `error` | システムエラー、即座に対応が必要 |

**実装例:**
```typescript
export async function middleware(request: NextRequest) {
  const response = await next()
  const statusCode = response.status
  
  // 400/500レベルのみログ
  if (statusCode >= 400 && statusCode < 500) {
    logger.warn('クライアントエラー', {
      path: request.nextUrl.pathname,
      statusCode,
      method: request.method,
    })
  } else if (statusCode >= 500) {
    logger.error('サーバーエラー', {
      path: request.nextUrl.pathname,
      statusCode,
      method: request.method,
    })
  }
  // 200/300レベルはログしない
  
  return response
}
```

### ❌ 過剰なログによるパフォーマンス劣化

**問題:**
- ディスクI/O負荷増加
- ログストレージコスト増加
- ログ処理（解析・検索）コスト増加
- 重要なログが埋もれる

```typescript
// ❌ 悪い例: 開発時のdebugログを本番環境に残す
export async function processQuests(quests: Quest[]) {
  logger.debug('処理開始') // 本番環境では不要
  
  for (const quest of quests) {
    logger.debug('クエスト処理', { questId: quest.id }) // 大量ログ
    logger.debug('ステータス確認', { status: quest.status })
    logger.debug('報酬計算', { reward: quest.reward })
    // ... 毎回ログ
  }
  
  logger.debug('処理完了')
}

// ✅ 良い例: 適切なログ量
export async function processQuests(quests: Quest[]) {
  logger.info('一括処理開始', { count: quests.length })
  
  const results = quests.map(quest => {
    // ループ内はログなし（またはエラー時のみ）
    return processQuest(quest)
  })
  
  const succeeded = results.filter(r => r.success).length
  logger.info('一括処理完了', { 
    total: quests.length, 
    succeeded,
    failed: quests.length - succeeded,
  })
}
```

**本番環境でのログ量削減策:**
1. **ログレベル制御**: 本番環境では `warn` または `error` のみ
2. **サンプリング**: 全リクエストの1%のみログ（高頻度APIの場合）
3. **集約**: ループ内はログせず、サマリーをログ
4. **条件付きログ**: エラー時やパフォーマンス劣化時のみログ

```typescript
// サンプリング実装例
const SAMPLE_RATE = 0.01 // 1%のみログ

export async function GET(request: NextRequest) {
  const shouldLog = Math.random() < SAMPLE_RATE
  
  if (shouldLog) {
    logger.debug('API呼び出しサンプル', {
      path: request.nextUrl.pathname,
      params: Object.fromEntries(request.nextUrl.searchParams),
    })
  }
  
  // ... 処理
}
```

---

## ログレベル使い分けのガイドライン

| レベル | 使用場面 | 例 |
|--------|----------|-----|
| **error** | 処理失敗、例外発生 | DB接続エラー、API呼び出し失敗 |
| **warn** | 問題になりうる状況、異常系 | データ不整合、権限エラー、既に完了済み |
| **info** | 重要な処理の開始・完了 | API リクエスト受信、クエスト作成成功 |
| **debug** | デバッグ用の詳細情報 | クエリパラメータ、返り値、条件分岐 |
| **trace** | 最も詳細な情報（関数呼び出し等） | 関数の入出力、詳細なフロー |

---

## 環境別の推奨設定

### 開発環境
```bash
NEXT_PUBLIC_LOG_LEVEL=debug
```
- すべてのデバッグ情報を見る
- パフォーマンスは気にしない

### ステージング環境
```bash
NEXT_PUBLIC_LOG_LEVEL=info
```
- 処理の流れは追跡できる
- 詳細なデバッグ情報は除外

### 本番環境
```bash
NEXT_PUBLIC_LOG_LEVEL=warn
```
または
```bash
NEXT_PUBLIC_LOG_LEVEL=error
```
- エラーと警告のみ
- パフォーマンス影響を最小化

---

## パフォーマンス計測用のログ

```typescript
export async function fetchQuestsWithTiming(familyId: string) {
  const startTime = performance.now()
  
  logger.info('クエスト取得開始', { familyId })
  
  try {
    const quests = await db.query.quests.findMany({
      where: eq(quests.familyId, familyId),
    })
    
    const duration = performance.now() - startTime
    
    logger.info('クエスト取得完了', {
      familyId,
      count: quests.length,
      duration: `${duration.toFixed(2)}ms`,
    })
    
    // 遅い場合は警告
    if (duration > 1000) {
      logger.warn('クエスト取得が遅い', {
        familyId,
        duration: `${duration.toFixed(2)}ms`,
      })
    }
    
    return quests
    
  } catch (error) {
    const duration = performance.now() - startTime
    
    logger.error('クエスト取得エラー', {
      familyId,
      duration: `${duration.toFixed(2)}ms`,
      error: error instanceof Error ? error.message : String(error),
    })
    
    throw error
  }
}
```

---

## まとめ: ログ配置のチェックリスト

### 基本チェックリスト（コードレビュー時）

#### 配置の適切性
- [ ] API エントリーポイントに info ログがある
- [ ] エラーハンドリング（catch ブロック）に error ログがある
- [ ] 重要な条件分岐に debug/warn ログがある
- [ ] DB操作の前後に debug ログがある
- [ ] ユーザー操作（重要なアクション）に info ログがある

#### コンテキストと内容
- [ ] ログに十分なコンテキスト情報（ID、パラメータ等）が含まれている
- [ ] コンテクストがなくても意味がわかるメッセージになっている
- [ ] 構造化された形式（JSONオブジェクト）でログしている
- [ ] エラー時に原因特定に必要な情報が含まれている

#### セキュリティとコンプライアンス
- [ ] 機密情報（パスワード、トークン、API キー）がログに含まれていない
- [ ] PII（個人を特定できる情報）の取り扱いが適切
- [ ] クレジットカード情報、銀行口座情報が含まれていない
- [ ] セッションIDはハッシュ化されている（必要な場合）
- [ ] データベース接続文字列が含まれていない

#### パフォーマンスとログ量
- [ ] ループ内に過度なログがない
- [ ] 200/300 HTTPステータスコードをログしていない（またはdebugレベル）
- [ ] 本番環境で不要な debug ログが残っていない
- [ ] 適切なログレベルが使用されている（開発: debug、本番: warn/error）

#### ログの用途を考慮
- [ ] 監査目的のログは info レベルで記録している
- [ ] パフォーマンス計測が必要な箇所に duration を記録している
- [ ] セキュリティイベント（認証失敗等）を記録している
- [ ] 統計・アラート用のイベントを適切に記録している

### 高度なチェックリスト

#### 記録すべきイベントの網羅性
- [ ] 認証イベント（成功・失敗）を記録している
- [ ] 承認の失敗を記録している
- [ ] 重要なデータ変更（作成・更新・削除）を記録している
- [ ] リスクの高いイベント（一括削除、データエクスポート等）を記録している
- [ ] アプリケーションエラーを記録している
- [ ] 入力/出力の検証失敗を記録している

#### 読者を考慮した設計
- [ ] エンドユーザー向けログ（error のみ）が適切
- [ ] 運用エンジニア向けログ（info/warn/error）が適切
- [ ] 開発者向けログ（すべてのレベル）が開発環境で有効

#### 構造化ロギング
- [ ] JSON形式またはキー・バリュー形式でログしている
- [ ] 一貫したキー名を使用している（userId, questId 等）
- [ ] タイムスタンプが自動的に付与されている
- [ ] 検索・フィルタリングしやすいフォーマットになっている

### 環境別チェック

#### 開発環境
- [ ] ログレベル: `debug` 以上
- [ ] 詳細なスタックトレースを含む
- [ ] パフォーマンス影響は無視

#### ステージング環境
- [ ] ログレベル: `info` 以上
- [ ] 本番環境と同等のログ設定でテスト
- [ ] ログ量が本番環境で許容範囲か確認

#### 本番環境
- [ ] ログレベル: `warn` または `error`
- [ ] 機密情報が一切含まれていないことを再確認
- [ ] ログ量がパフォーマンスとコストに影響しない
- [ ] アラート設定が適切に機能する

### ベストプラクティス確認

#### ✅ 実装されているべきこと
- [ ] 環境変数でログレベルを制御できる
- [ ] エラー時に必要な情報が全て含まれる
- [ ] ログメッセージが意味をなす（コンテクスト独立）
- [ ] 構造化されたログフォーマット
- [ ] 適切なログレベルの使い分け

#### ❌ 避けるべきこと
- [ ] console.log の直接使用（logger を使う）
- [ ] ループ内の過度なログ
- [ ] 正常系の200レスポンスを毎回ログ
- [ ] 機密情報の記録
- [ ] 本番環境での debug ログの大量出力
- [ ] コンテクスト不足のメッセージ（"エラー"、"失敗" のみ）

### ログの品質チェック

#### メッセージの質
- [ ] 「何が」起きたかが明確
- [ ] 「誰が」実行したかが明確（該当する場合）
- [ ] 「なぜ」失敗したかが明確（エラー時）
- [ ] 「どうすれば」修正できるかのヒント（可能な場合）

#### パフォーマンス影響
- [ ] ログ出力がクリティカルパスを阻害していない
- [ ] 大量データのログ出力を避けている
- [ ] 本番環境でのログ量が許容範囲内

#### 検索性と分析可能性
- [ ] 特定のユーザーのログを検索できる
- [ ] 特定のリソース（quest等）のログを検索できる
- [ ] エラー率を計算できる
- [ ] パフォーマンス分析ができる

---

## 継続的改善

ログは一度実装して終わりではなく、継続的に改善する必要がある：

1. **定期的なログレビュー** - 本番環境のログを定期的にレビューし、不足や過剰を特定
2. **アラートの調整** - 誤検知を減らし、重要なイベントを逃さないように調整
3. **ログ量の監視** - ログストレージコストとパフォーマンス影響を監視
4. **チームでのレビュー** - コードレビュー時にログの適切性を確認
5. **フィードバックループ** - トラブルシューティング時に不足していた情報を追加

ログは運用の目となり耳となる。適切に配置されたログは、問題の早期発見と迅速な解決を可能にする。
