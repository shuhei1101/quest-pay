import { eq, and } from "drizzle-orm"
import type { Db } from "@/index"
import { familyAgeRewardTables, rewardByAges, type RewardByAgeSelect, type FamilyAgeRewardTableSelect } from "@/drizzle/schema"

/** 返り値の型 */
type FetchFamilyAgeRewardTableResult = {
  table: FamilyAgeRewardTableSelect
  rewards: RewardByAgeSelect[]
}

/** 家族の年齢別報酬テーブルを取得する */
export const fetchFamilyAgeRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}): Promise<FetchFamilyAgeRewardTableResult | null> => {
  // 家族の年齢別報酬テーブルを取得する
  const familyTable = await db
    .select()
    .from(familyAgeRewardTables)
    .where(eq(familyAgeRewardTables.familyId, familyId))
    .limit(1)

  // テーブルが存在しない場合はnullを返す
  if (!familyTable.length) {
    return null
  }

  // 報酬データを取得する
  const rewards = await db
    .select()
    .from(rewardByAges)
    .where(
      and(
        eq(rewardByAges.type, "family"),
        eq(rewardByAges.ageRewardTableId, familyTable[0].id)
      )
    )
    .orderBy(rewardByAges.age)

  return {
    table: familyTable[0],
    rewards
  }
}
