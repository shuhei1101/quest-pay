import { eq, and } from "drizzle-orm"
import type { Db } from "@/index"
import { rewardByLevels, type RewardByLevelSelect, type levelRewardTableType } from "@/drizzle/schema"

/** レベル別報酬データを取得する */
export const fetchLevelRewards = async ({
  db,
  levelRewardTableId,
  type = "family"
}: {
  db: Db
  levelRewardTableId: string
  type?: typeof levelRewardTableType.enumValues[number]
}): Promise<RewardByLevelSelect[]> => {
  const rewards = await db
    .select()
    .from(rewardByLevels)
    .where(
      and(
        eq(rewardByLevels.type, type),
        eq(rewardByLevels.levelRewardTableId, levelRewardTableId)
      )
    )
    .orderBy(rewardByLevels.level)

  return rewards
}
