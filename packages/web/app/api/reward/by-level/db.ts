import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { rewardByLevels } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq, and } from "drizzle-orm"

/** レベル別報酬のデフォルトデータを作成する */
export const insertDefaultLevelRewards = async ({
  db,
  levelRewardTableId
}: {
  db: Db
  levelRewardTableId: string
}) => {
  try {
    // デフォルトのレベル別報酬を作成する（レベル1～12まで、月額0円）
    const defaultRewards = Array.from({ length: 12 }, (_, i) => ({
      type: "family" as const,
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

/** レベル別報酬を更新する */
export const updateLevelReward = async ({
  db,
  levelRewardTableId,
  level,
  amount
}: {
  db: Db
  levelRewardTableId: string
  level: number
  amount: number
}) => {
  try {
    await db
      .update(rewardByLevels)
      .set({ amount })
      .where(
        and(
          eq(rewardByLevels.type, "family"),
          eq(rewardByLevels.levelRewardTableId, levelRewardTableId),
          eq(rewardByLevels.level, level)
        )
      )
  } catch (error) {
    devLog("updateLevelReward error:", error)
    throw new DatabaseError("レベル別報酬の更新に失敗しました。")
  }
}
