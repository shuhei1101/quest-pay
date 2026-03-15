(2026年3月15日 14:30記載)

# トランザクション例

## トランザクションの基本

### トランザクションの使用タイミング
1. 複数のテーブルを更新する場合
2. データの整合性が重要な場合
3. ロールバックが必要な処理

### 基本構文

```ts
import { db } from "@/app/(core)/_supabase/db"

const result = await db.transaction(async (tx) => {
  // トランザクション内の処理
  const quest = await tx.insert(questsTable).values(data).returning()
  const detail = await tx.insert(detailsTable).values(detailData).returning()
  
  return { quest, detail }
})
```

## 実装パターン

### service.tsでのトランザクション

**ファイル構成:**
```ts
// service.ts
import { db } from "@/app/(core)/_supabase/db"
import { createQuest } from "./db"
import { createReward } from "../rewards/db"

/** クエストと報酬を同時に作成する */
export const createQuestWithReward = async (
  questData: NewQuest,
  rewardData: NewReward
) => {
  return await db.transaction(async (tx) => {
    // クエスト作成
    const quest = await createQuest(questData)
    
    // 報酬作成（クエストIDを使用）
    const reward = await createReward({ 
      ...rewardData, 
      quest_id: quest.id 
    })
    
    return { quest, reward }
  })
}
```

### 排他制御を伴うトランザクション

```ts
import { checkVersion } from "@/app/api/_db_helper/db_helper"
import { questsTable, childQuestsTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"

/** クエストを承認して報酬を付与する */
export const approveQuestWithReward = async (
  questId: string,
  childId: string,
  currentVersion: number
) => {
  return await db.transaction(async (tx) => {
    // バージョンチェック（排他制御）
    await checkVersion(tx, childQuestsTable, questId, currentVersion)
    
    // 子供クエストを更新
    const [updatedQuest] = await tx
      .update(childQuestsTable)
      .set({
        status: "completed",
        version: currentVersion + 1,
        completed_at: new Date(),
      })
      .where(and(
        eq(childQuestsTable.id, questId),
        eq(childQuestsTable.version, currentVersion)
      ))
      .returning()
    
    // 子供の報酬を更新
    await tx
      .update(childrenTable)
      .set({
        total_earned: sql`${childrenTable.total_earned} + ${updatedQuest.reward}`,
        total_savings: sql`${childrenTable.total_savings} + ${updatedQuest.reward}`,
      })
      .where(eq(childrenTable.id, childId))
    
    return updatedQuest
  })
}
```

## よくあるパターン

### パターン1: クエスト作成＋詳細作成

```ts
import { questsTable, questDetailsTable } from "@/drizzle/schema"

export const createQuestWithDetails = async (
  questData: NewQuest,
  detailsData: NewQuestDetail[]
) => {
  return await db.transaction(async (tx) => {
    // クエスト作成
    const [quest] = await tx
      .insert(questsTable)
      .values(questData)
      .returning()
    
    // 詳細作成（複数）
    const details = await tx
      .insert(questDetailsTable)
      .values(detailsData.map(detail => ({
        ...detail,
        quest_id: quest.id
      })))
      .returning()
    
    return { quest, details }
  })
}
```

### パターン2: ステータス更新＋履歴記録

```ts
import { questsTable, questHistoryTable } from "@/drizzle/schema"

export const updateQuestStatus = async (
  questId: string,
  newStatus: string,
  userId: string
) => {
  return await db.transaction(async (tx) => {
    // ステータス更新
    const [updatedQuest] = await tx
      .update(questsTable)
      .set({
        status: newStatus,
        updated_at: new Date(),
      })
      .where(eq(questsTable.id, questId))
      .returning()
    
    // 履歴記録
    await tx
      .insert(questHistoryTable)
      .values({
        quest_id: questId,
        user_id: userId,
        action: `status_changed_to_${newStatus}`,
        created_at: new Date(),
      })
    
    return updatedQuest
  })
}
```

### パターン3: 親子関係の削除

```ts
import { questsTable, questDetailsTable, childQuestsTable } from "@/drizzle/schema"

export const deleteQuestWithChildren = async (questId: string) => {
  return await db.transaction(async (tx) => {
    // 子供クエストを削除
    await tx
      .delete(childQuestsTable)
      .where(eq(childQuestsTable.family_quest_id, questId))
    
    // クエスト詳細を削除
    await tx
      .delete(questDetailsTable)
      .where(eq(questDetailsTable.quest_id, questId))
    
    // クエストを削除
    await tx
      .delete(questsTable)
      .where(eq(questsTable.id, questId))
  })
}
```

### パターン4: 報酬付与＋経験値加算＋レベルアップ

```ts
import { childrenTable, childQuestsTable } from "@/drizzle/schema"
import { sql } from "drizzle-orm"

export const completeQuestWithRewards = async (
  questId: string,
  childId: string,
  reward: number,
  exp: number
) => {
  return await db.transaction(async (tx) => {
    // クエスト完了
    await tx
      .update(childQuestsTable)
      .set({
        status: "completed",
        completed_at: new Date(),
      })
      .where(eq(childQuestsTable.id, questId))
    
    // 子供情報取得
    const [child] = await tx
      .select()
      .from(childrenTable)
      .where(eq(childrenTable.id, childId))
      .limit(1)
    
    // 新しい経験値とレベル計算
    const newExp = child.exp + exp
    const newLevel = Math.floor(newExp / 100) + 1
    
    // 報酬と経験値を更新
    const [updatedChild] = await tx
      .update(childrenTable)
      .set({
        total_earned: sql`${childrenTable.total_earned} + ${reward}`,
        total_savings: sql`${childrenTable.total_savings} + ${reward}`,
        exp: newExp,
        level: newLevel,
      })
      .where(eq(childrenTable.id, childId))
      .returning()
    
    return updatedChild
  })
}
```

## エラーハンドリング

### トランザクション内のエラー処理

```ts
export const createQuestWithDetails = async (data: QuestData) => {
  try {
    return await db.transaction(async (tx) => {
      const quest = await tx.insert(questsTable).values(data.quest).returning()
      const details = await tx.insert(questDetailsTable).values(data.details).returning()
      
      return { quest, details }
    })
  } catch (error) {
    logger.error('クエスト作成に失敗しました', error)
    throw new Error('クエストの作成に失敗しました')
  }
}
```

### バリデーションエラー

```ts
export const updateQuestStatus = async (
  questId: string,
  newStatus: string
) => {
  return await db.transaction(async (tx) => {
    // 現在のクエストを取得
    const [quest] = await tx
      .select()
      .from(questsTable)
      .where(eq(questsTable.id, questId))
      .limit(1)
    
    if (!quest) {
      throw new Error('クエストが見つかりません')
    }
    
    // ステータス遷移のバリデーション
    if (quest.status === 'completed' && newStatus !== 'completed') {
      throw new Error('完了済みのクエストは変更できません')
    }
    
    // 更新処理
    const [updatedQuest] = await tx
      .update(questsTable)
      .set({ status: newStatus })
      .where(eq(questsTable.id, questId))
      .returning()
    
    return updatedQuest
  })
}
```

## パフォーマンス最適化

### バッチ挿入

```ts
// 大量のレコードを挿入する場合
export const createManyQuests = async (questsData: NewQuest[]) => {
  // 一度に挿入するバッチサイズ
  const BATCH_SIZE = 100
  
  const results = []
  
  for (let i = 0; i < questsData.length; i += BATCH_SIZE) {
    const batch = questsData.slice(i, i + BATCH_SIZE)
    
    const batchResults = await db.transaction(async (tx) => {
      return await tx
        .insert(questsTable)
        .values(batch)
        .returning()
    })
    
    results.push(...batchResults)
  }
  
  return results
}
```
