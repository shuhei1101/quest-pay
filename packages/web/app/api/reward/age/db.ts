import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { rewardByAges } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq, and } from "drizzle-orm"

/** 年齢別報酬のデフォルトデータを作成する */
export const insertDefaultAgeRewards = async ({
  db,
  ageRewardTableId
}: {
  db: Db
  ageRewardTableId: string
}) => {
  try {
    // デフォルトの年齢別報酬を作成する（5歳～22歳まで、月額0円）
    const defaultRewards = Array.from({ length: 18 }, (_, i) => ({
      type: "family" as const,
      ageRewardTableId,
      age: i + 5,
      amount: 0
    }))
    
    await db.insert(rewardByAges).values(defaultRewards)
  } catch (error) {
    devLog("insertDefaultAgeRewards error:", error)
    throw new DatabaseError("デフォルト年齢別報酬の作成に失敗しました。")
  }
}

/** 年齢別報酬を更新する */
export const updateAgeReward = async ({
  db,
  ageRewardTableId,
  age,
  amount
}: {
  db: Db
  ageRewardTableId: string
  age: number
  amount: number
}) => {
  try {
    await db
      .update(rewardByAges)
      .set({ amount })
      .where(
        and(
          eq(rewardByAges.type, "family"),
          eq(rewardByAges.ageRewardTableId, ageRewardTableId),
          eq(rewardByAges.age, age)
        )
      )
  } catch (error) {
    devLog("updateAgeReward error:", error)
    throw new DatabaseError("年齢別報酬の更新に失敗しました。")
  }
}
