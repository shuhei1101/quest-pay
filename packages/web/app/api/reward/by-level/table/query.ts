import { eq } from "drizzle-orm"
import type { Db } from "@/index"
import { familyLevelRewardTables, type FamilyLevelRewardTableSelect } from "@/drizzle/schema"

/** 家族のレベル別報酬テーブルを取得する */
export const fetchFamilyLevelRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}): Promise<FamilyLevelRewardTableSelect | null> => {
  const familyTable = await db
    .select()
    .from(familyLevelRewardTables)
    .where(eq(familyLevelRewardTables.familyId, familyId))
    .limit(1)

  return familyTable.length > 0 ? familyTable[0] : null
}
