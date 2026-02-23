import { eq } from "drizzle-orm"
import type { Db } from "@/index"
import { childAgeRewardTables, type ChildAgeRewardTableSelect } from "@/drizzle/schema"

/** 子供の年齢別報酬テーブルを取得する */
export const fetchChildAgeRewardTable = async ({
  db,
  childId
}: {
  db: Db
  childId: string
}): Promise<ChildAgeRewardTableSelect | null> => {
  const childTable = await db
    .select()
    .from(childAgeRewardTables)
    .where(eq(childAgeRewardTables.childId, childId))
    .limit(1)

  return childTable.length > 0 ? childTable[0] : null
}
