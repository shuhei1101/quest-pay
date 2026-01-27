import { eq, and } from "drizzle-orm"
import type { Db } from "@/index"
import { familyLevelRewardTables, rewardByLevels, type RewardByLevelSelect, type FamilyLevelRewardTableSelect } from "@/drizzle/schema"

/** 返り値の型 */
type FetchFamilyLevelRewardTableResult = {
  table: FamilyLevelRewardTableSelect
  rewards: RewardByLevelSelect[]
}

/** 家族のレベル別報酬テーブルを取得する */
export const fetchFamilyLevelRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}): Promise<FetchFamilyLevelRewardTableResult | null> => {
  // 家族のレベル別報酬テーブルを取得する
  const familyTable = await db
    .select()
    .from(familyLevelRewardTables)
    .where(eq(familyLevelRewardTables.familyId, familyId))
    .limit(1)

  // テーブルが存在しない場合はnullを返す
  if (!familyTable.length) {
    return null
  }

  // 報酬データを取得する
  const rewards = await db
    .select()
    .from(rewardByLevels)
    .where(
      and(
        eq(rewardByLevels.type, "family"),
        eq(rewardByLevels.levelRewardTableId, familyTable[0].id)
      )
    )
    .orderBy(rewardByLevels.level)

  return {
    table: familyTable[0],
    rewards
  }
}
