import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { updateLevelReward } from "./db"

/** 家族のレベル別報酬を一括更新する */
export const updateFamilyLevelRewards = async ({
  db,
  levelRewardTableId,
  rewards
}: {
  db: Db
  levelRewardTableId: string
  rewards: Array<{ level: number; amount: number }>
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 報酬を更新する
      for (const reward of rewards) {
        await updateLevelReward({
          db: tx,
          levelRewardTableId,
          level: reward.level,
          amount: reward.amount
        })
      }
    })
  } catch (error) {
    devLog("updateFamilyLevelRewards error:", error)
    throw new DatabaseError("レベル別報酬の更新に失敗しました。")
  }
}
