import { DatabaseError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"
import { rewardByAges, type ageRewardTableType } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq, and } from "drizzle-orm"

/** 年齢別報酬のデフォルトデータを作成する */
export const insertDefaultAgeRewards = async ({
  db,
  ageRewardTableId,
  type = "family"
}: {
  db: Db
  ageRewardTableId: string
  type?: typeof ageRewardTableType.enumValues[number]
}) => {
  try {
    // デフォルトの年齢別報酬を作成する（5歳～22歳まで、月額0円）
    const defaultRewards = Array.from({ length: 18 }, (_, i) => ({
      type,
      ageRewardTableId,
      age: i + 5,
      amount: 0
    }))
    
    await db.insert(rewardByAges).values(defaultRewards)
  } catch (error) {
    logger.error("insertDefaultAgeRewards error", { error })
    throw new DatabaseError("デフォルト年齢別報酬の作成に失敗しました。")
  }
}

/** 年齢別報酬を更新または挿入する（UPSERT） */
export const updateAgeReward = async ({
  db,
  ageRewardTableId,
  age,
  amount,
  type = "family"
}: {
  db: Db
  ageRewardTableId: string
  age: number
  amount: number
  type?: typeof ageRewardTableType.enumValues[number]
}) => {
  try {
    // 既存のレコードを確認
    const existing = await db
      .select()
      .from(rewardByAges)
      .where(
        and(
          eq(rewardByAges.type, type),
          eq(rewardByAges.ageRewardTableId, ageRewardTableId),
          eq(rewardByAges.age, age)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // UPDATEを実行
      await db
        .update(rewardByAges)
        .set({ amount })
        .where(
          and(
            eq(rewardByAges.type, type),
            eq(rewardByAges.ageRewardTableId, ageRewardTableId),
            eq(rewardByAges.age, age)
          )
        )
    } else {
      // INSERTを実行
      await db
        .insert(rewardByAges)
        .values({
          type,
          ageRewardTableId,
          age,
          amount
        })
    }
  } catch (error) {
    logger.error("updateAgeReward error", { error })
    throw new DatabaseError("年齢別報酬の更新に失敗しました。")
  }
}
