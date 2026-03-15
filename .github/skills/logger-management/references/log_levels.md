(2026年3月15日 14:30記載)

# ログレベル詳細ガイド

## ログレベル一覧

loglevel では以下のログレベルが利用可能です：

| レベル | 重要度 | 用途 | 本番環境 |
|--------|--------|------|----------|
| **debug** | 5 | 開発時のデバッグ情報 | ❌ 非表示 |
| **info** | 4 | 通常の処理フロー | ⚠️ 状況次第 |
| **warn** | 3 | 警告（処理は継続） | ✅ 表示 |
| **error** | 2 | エラー（処理失敗） | ✅ 表示 |

## 各レベルの詳細

### 1. debug（デバッグ）

**用途：**
- 開発時の詳細なトレース
- データベースクエリの実行内容
- 条件分岐の詳細
- 変数の値の確認

**使用例：**
```typescript
logger.debug('DB: クエリ実行', { 
  table: 'family_quests', 
  where: { familyId } 
})

logger.debug('条件分岐: ステータスチェック', { 
  status: quest.status,
  expected: 'pending_review' 
})

logger.debug('変数確認', { 
  userId: user.id, 
  familyId: family.id 
})
```

**本番環境：** 通常は非表示（パフォーマンスへの影響を避けるため）

### 2. info（情報）

**用途：**
- 処理の開始・完了
- APIリクエストの記録
- 重要な操作の成功
- ビジネスイベントの記録

**使用例：**
```typescript
logger.info('クエスト作成開始', { familyId, title })

logger.info('クエスト作成成功', { questId: newQuest.id })

logger.info('クエスト承認完了', { 
  questId, 
  childId, 
  reward: 100 
})

logger.info('ユーザーログイン', { 
  userId: user.id, 
  loginType: 'parent' 
})
```

**本番環境：** 状況次第
- トラフィックが少ない場合：表示OK
- トラフィックが多い場合：warn以上に制限

### 3. warn（警告）

**用途：**
- 異常だが処理は継続できる状態
- 非推奨の機能の使用
- リソース不足の警告
- データの不整合（回復可能）

**使用例：**
```typescript
logger.warn('認証エラー: トークンが存在しません')

logger.warn('データ不整合: 報酬テーブルが見つかりません', { 
  childId 
})

logger.warn('非推奨機能の使用', { 
  feature: 'old-reward-system' 
})

logger.warn('リトライ実行', { 
  attempt: 2, 
  maxAttempts: 3 
})
```

**本番環境：** 表示推奨（運用上重要な情報）

### 4. error（エラー）

**用途：**
- 処理が失敗した
- 例外が発生した
- システムエラー
- データベースエラー

**使用例：**
```typescript
logger.error('クエスト作成失敗', error)

logger.error('データベースエラー', error, { 
  query: 'INSERT INTO family_quests',
  familyId 
})

logger.error('外部API呼び出し失敗', error, { 
  api: 'stripe',
  endpoint: '/payments' 
})

logger.error('バリデーションエラー', error, { 
  field: 'title',
  value: data.title 
})
```

**本番環境：** 必ず表示（エラー監視必須）

## 環境別のログレベル設定

### 開発環境

```bash
NEXT_PUBLIC_LOG_LEVEL=debug
```

**表示されるログ：**
- ✅ debug
- ✅ info
- ✅ warn
- ✅ error

**理由：** すべてのログを確認してデバッグを効率化

### ステージング環境

```bash
NEXT_PUBLIC_LOG_LEVEL=info
```

**表示されるログ：**
- ❌ debug
- ✅ info
- ✅ warn
- ✅ error

**理由：** 本番に近い状態でフローを確認

### 本番環境（低トラフィック）

```bash
NEXT_PUBLIC_LOG_LEVEL=info
```

**表示されるログ：**
- ❌ debug
- ✅ info
- ✅ warn
- ✅ error

**理由：** 処理フローの記録を残しつつ、パフォーマンスへの影響を最小化

### 本番環境（高トラフィック）

```bash
NEXT_PUBLIC_LOG_LEVEL=warn
```

**表示されるログ：**
- ❌ debug
- ❌ info
- ✅ warn
- ✅ error

**理由：** ログ量を削減してパフォーマンスを優先

## ログレベルの選び方フローチャート

```
エラーが発生した？
├─ YES → error
└─ NO
    │
    異常だが処理は継続できる？
    ├─ YES → warn
    └─ NO
        │
        ビジネス上重要な操作？
        ├─ YES → info
        └─ NO
            │
            開発時のデバッグに必要？
            ├─ YES → debug
            └─ NO → ログ不要
```

## 実践的な使い分け例

### シナリオ1: クエスト作成処理

```typescript
export async function createQuest(data: CreateQuestInput) {
  // 処理開始
  logger.info('クエスト作成開始', { familyId: data.familyId })
  
  // バリデーション
  logger.debug('バリデーション実行', { data })
  
  if (!isValid(data)) {
    // エラー
    logger.error('バリデーションエラー', new Error('Invalid data'), { data })
    throw new Error('Invalid data')
  }
  
  try {
    // DB挿入
    logger.debug('DB: クエスト挿入開始')
    const quest = await db.insert(familyQuests).values(data)
    logger.debug('DB: クエスト挿入完了', { questId: quest.id })
    
    // 処理完了
    logger.info('クエスト作成成功', { questId: quest.id })
    return quest
    
  } catch (error) {
    // エラー
    logger.error('クエスト作成失敗', error)
    throw error
  }
}
```

### シナリオ2: クエスト承認処理

```typescript
export async function approveQuest(questId: string, childId: string) {
  logger.info('クエスト承認開始', { questId, childId })
  
  // ステータス確認
  const quest = await findQuest(questId)
  logger.debug('クエストステータス確認', { status: quest.status })
  
  if (quest.status !== 'pending_review') {
    // 警告（処理は継続しない）
    logger.warn('承認不可: ステータスが不正', { 
      questId, 
      status: quest.status,
      expected: 'pending_review' 
    })
    throw new Error('Invalid status')
  }
  
  try {
    // トランザクション
    logger.debug('トランザクション開始')
    await db.transaction(async (tx) => {
      // ステータス更新
      logger.debug('ステータス更新: completed')
      await updateStatus(tx, questId, 'completed')
      
      // 報酬付与
      logger.debug('報酬付与', { reward: quest.reward })
      await giveReward(tx, childId, quest.reward)
    })
    logger.debug('トランザクション完了')
    
    logger.info('クエスト承認完了', { questId, childId })
    
  } catch (error) {
    logger.error('クエスト承認失敗', error)
    throw error
  }
}
```

## まとめ

| 状況 | ログレベル | 例 |
|------|-----------|-----|
| エラー発生 | error | データベースエラー、API失敗 |
| 異常だが継続可能 | warn | トークン切れ、リトライ実行 |
| 重要な操作の記録 | info | クエスト作成、ユーザーログイン |
| デバッグ情報 | debug | DBクエリ、変数の値 |
