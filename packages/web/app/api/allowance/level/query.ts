import { eq, and } from "drizzle-orm"
import type { DrizzleClient } from "@/app/(core)/_db/drizzle"
import { familyLevelRewardTables, rewardByLevels } from "@/drizzle/schema"

/** 家族のレベル別報酬テーブルを取得する */
export const fetchFamilyLevelRewardTable = async ({
  db,
  familyId
}: {
  db: DrizzleClient
  familyId: string
}) => {
  // 家族のレベル別報酬テーブルを取得する
  const familyTable = await db
    .select()
    .from(familyLevelRewardTables)
    .where(eq(familyLevelRewardTables.familyId, familyId))
    .limit(1)

  // テーブルが存在しない場合は作成する
  if (!familyTable.length) {
    const [newTable] = await db
      .insert(familyLevelRewardTables)
      .values({ familyId })
      .returning()
    
    // デフォルトのレベル別報酬を作成する（レベル1～12まで、月額0円）
    const defaultRewards = Array.from({ length: 12 }, (_, i) => ({
      type: "family" as const,
      levelRewardTableId: newTable.id,
      level: i + 1,
      amount: 0
    }))
    
    await db.insert(rewardByLevels).values(defaultRewards)
    
    // 再度取得する
    return fetchFamilyLevelRewardTable({ db, familyId })
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
