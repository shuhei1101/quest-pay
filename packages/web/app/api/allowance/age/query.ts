import { eq, and, sql } from "drizzle-orm"
import type { DrizzleClient } from "@/app/(core)/_db/drizzle"
import { familyAgeRewardTables, rewardByAges, families } from "@/drizzle/schema"

/** 家族の年齢別報酬テーブルを取得する */
export const fetchFamilyAgeRewardTable = async ({
  db,
  familyId
}: {
  db: DrizzleClient
  familyId: string
}) => {
  // 家族の年齢別報酬テーブルを取得する
  const familyTable = await db
    .select()
    .from(familyAgeRewardTables)
    .where(eq(familyAgeRewardTables.familyId, familyId))
    .limit(1)

  // テーブルが存在しない場合は作成する
  if (!familyTable.length) {
    const [newTable] = await db
      .insert(familyAgeRewardTables)
      .values({ familyId })
      .returning()
    
    // デフォルトの年齢別報酬を作成する（5歳～22歳まで、月額0円）
    const defaultRewards = Array.from({ length: 18 }, (_, i) => ({
      type: "family" as const,
      ageRewardTableId: newTable.id,
      age: i + 5,
      amount: 0
    }))
    
    await db.insert(rewardByAges).values(defaultRewards)
    
    // 再度取得する
    return fetchFamilyAgeRewardTable({ db, familyId })
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
