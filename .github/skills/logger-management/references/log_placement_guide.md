# ログ配置ガイド - デバッグに効果的なログ戦略

## ログ配置の基本原則

### 1. 処理の流れを追跡できる

デバッグ時に「どこまで実行されたか」「どの分岐に入ったか」が分かるようにする。

### 2. 問題発生時の情報が十分にある

エラー発生時に、原因特定に必要な情報（ID、パラメータ、状態）を含める。

### 3. パフォーマンス影響を最小限に

本番環境で不要なログは debug/trace レベルにして、環境変数で制御できるようにする。

### 4. ノイズを避ける

ループ内の過度なログ、既知の正常系の詳細ログは避ける。

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

コードレビュー時に確認:

- [ ] API エントリーポイントに info ログがある
- [ ] エラーハンドリングに error ログがある
- [ ] 重要な条件分岐に debug/warn ログがある
- [ ] DB操作の前後に debug ログがある
- [ ] ユーザー操作に info ログがある
- [ ] ログに十分なコンテキスト情報（ID等）が含まれている
- [ ] 機密情報がログに含まれていない
- [ ] ループ内に過度なログがない
- [ ] 適切なログレベルが使用されている
