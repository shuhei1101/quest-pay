import { DatabaseError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { updateLevelReward } from "./db"
import type { levelRewardTableType } from "@/drizzle/schema"

/** 家族のレベル別報酬を一括更新する */
export const updateFamilyLevelRewards = async ({
  db,
  levelRewardTableId,
  rewards,
  type = "family"
}: {
  db: Db
  levelRewardTableId: string
  rewards: Array<{ level: number; amount: number }>
  type?: typeof levelRewardTableType.enumValues[number]
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 報酬を更新する
      for (const reward of rewards) {
        await updateLevelReward({
          db: tx,
          levelRewardTableId,
          level: reward.level,
          amount: reward.amount,
          type
        })
      }
    })
  } catch (error) {
    throw new DatabaseError("レベル別報酬の更新に失敗しました。")
  }
}
