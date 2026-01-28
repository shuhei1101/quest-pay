import { eq } from "drizzle-orm"
import type { Db } from "@/index"
import { familyAgeRewardTables, type FamilyAgeRewardTableSelect } from "@/drizzle/schema"

/** 家族の年齢別報酬テーブルを取得する */
export const fetchFamilyAgeRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}): Promise<FamilyAgeRewardTableSelect | null> => {
  const familyTable = await db
    .select()
    .from(familyAgeRewardTables)
    .where(eq(familyAgeRewardTables.familyId, familyId))
    .limit(1)

  return familyTable.length > 0 ? familyTable[0] : null
}
