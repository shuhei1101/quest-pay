import { eq, and } from "drizzle-orm"
import type { Db } from "@/index"
import { rewardByAges, type RewardByAgeSelect } from "@/drizzle/schema"

/** 年齢別報酬データを取得する */
export const fetchAgeRewards = async ({
  db,
  ageRewardTableId
}: {
  db: Db
  ageRewardTableId: string
}): Promise<RewardByAgeSelect[]> => {
  const rewards = await db
    .select()
    .from(rewardByAges)
    .where(
      and(
        eq(rewardByAges.type, "family"),
        eq(rewardByAges.ageRewardTableId, ageRewardTableId)
      )
    )
    .orderBy(rewardByAges.age)

  return rewards
}
