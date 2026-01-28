import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { updateAgeReward } from "./db"

/** 家族の年齢別報酬を一括更新する */
export const updateFamilyAgeRewards = async ({
  db,
  ageRewardTableId,
  rewards
}: {
  db: Db
  ageRewardTableId: string
  rewards: Array<{ age: number; amount: number }>
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 報酬を更新する
      for (const reward of rewards) {
        await updateAgeReward({
          db: tx,
          ageRewardTableId,
          age: reward.age,
          amount: reward.amount
        })
      }
    })
  } catch (error) {
    devLog("updateFamilyAgeRewards error:", error)
    throw new DatabaseError("年齢別報酬の更新に失敗しました。")
  }
}
