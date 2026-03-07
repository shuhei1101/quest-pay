import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { rewardByLevels, type levelRewardTableType } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq, and } from "drizzle-orm"

/** レベル別報酬のデフォルトデータを作成する */
export const insertDefaultLevelRewards = async ({
  db,
  levelRewardTableId,
  type = "family"
}: {
  db: Db
  levelRewardTableId: string
  type?: typeof levelRewardTableType.enumValues[number]
}) => {
  try {
    // デフォルトのレベル別報酬を作成する（レベル1～12まで、月額0円）
    const defaultRewards = Array.from({ length: 12 }, (_, i) => ({
      type,
      levelRewardTableId,
      level: i + 1,
      amount: 0
    }))
    
    await db.insert(rewardByLevels).values(defaultRewards)
  } catch (error) {
    devLog("insertDefaultLevelRewards error:", error)
    throw new DatabaseError("デフォルトレベル別報酬の作成に失敗しました。")
  }
}

/** レベル別報酬を更新または挿入する（UPSERT） */
export const updateLevelReward = async ({
  db,
  levelRewardTableId,
  level,
  amount,
  type = "family"
}: {
  db: Db
  levelRewardTableId: string
  level: number
  amount: number
  type?: typeof levelRewardTableType.enumValues[number]
}) => {
  try {
    // 既存のレコードを確認
    const existing = await db
      .select()
      .from(rewardByLevels)
      .where(
        and(
          eq(rewardByLevels.type, type),
          eq(rewardByLevels.levelRewardTableId, levelRewardTableId),
          eq(rewardByLevels.level, level)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // UPDATEを実行
      await db
        .update(rewardByLevels)
        .set({ amount })
        .where(
          and(
            eq(rewardByLevels.type, type),
            eq(rewardByLevels.levelRewardTableId, levelRewardTableId),
            eq(rewardByLevels.level, level)
          )
        )
    } else {
      // INSERTを実行
      await db
        .insert(rewardByLevels)
        .values({
          type,
          levelRewardTableId,
          level,
          amount
        })
    }
  } catch (error) {
    devLog("updateLevelReward error:", error)
    throw new DatabaseError("レベル別報酬の更新に失敗しました。")
  }
}
