import { eq, and } from "drizzle-orm"
import type { Db } from "@/index"
import { rewardByAges, type RewardByAgeSelect, type ageRewardTableType } from "@/drizzle/schema"

/** 年齢別報酬データを取得する */
export const fetchAgeRewards = async ({
  db,
  ageRewardTableId,
  type = "family"
}: {
  db: Db
  ageRewardTableId: string
  type?: typeof ageRewardTableType.enumValues[number]
}): Promise<RewardByAgeSelect[]> => {
  const rewards = await db
    .select()
    .from(rewardByAges)
    .where(
      and(
        eq(rewardByAges.type, type),
        eq(rewardByAges.ageRewardTableId, ageRewardTableId)
      )
    )
    .orderBy(rewardByAges.age)

  return rewards
}
