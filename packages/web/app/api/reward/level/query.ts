import { eq, and } from "drizzle-orm"
import type { Db } from "@/index"
import { rewardByLevels, type RewardByLevelSelect } from "@/drizzle/schema"

/** レベル別報酬データを取得する */
export const fetchLevelRewards = async ({
  db,
  levelRewardTableId
}: {
  db: Db
  levelRewardTableId: string
}): Promise<RewardByLevelSelect[]> => {
  const rewards = await db
    .select()
    .from(rewardByLevels)
    .where(
      and(
        eq(rewardByLevels.type, "family"),
        eq(rewardByLevels.levelRewardTableId, levelRewardTableId)
      )
    )
    .orderBy(rewardByLevels.level)

  return rewards
}
