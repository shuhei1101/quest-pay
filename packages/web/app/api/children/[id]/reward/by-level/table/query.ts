import { eq } from "drizzle-orm"
import type { Db } from "@/index"
import { childLevelRewardTables, type ChildLevelRewardTableSelect } from "@/drizzle/schema"

/** 子供のレベル別報酬テーブルを取得する */
export const fetchChildLevelRewardTable = async ({
  db,
  childId
}: {
  db: Db
  childId: string
}): Promise<ChildLevelRewardTableSelect | null> => {
  const childTable = await db
    .select()
    .from(childLevelRewardTables)
    .where(eq(childLevelRewardTables.childId, childId))
    .limit(1)

  return childTable.length > 0 ? childTable[0] : null
}
