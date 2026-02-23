import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { childLevelRewardTables } from "@/drizzle/schema"
import { Db } from "@/index"

/** 子供のレベル別報酬テーブルを作成する */
export const insertChildLevelRewardTable = async ({
  db,
  childId
}: {
  db: Db
  childId: string
}) => {
  try {
    const result = await db
      .insert(childLevelRewardTables)
      .values({ childId })
      .returning()
    
    return result[0]
  } catch (error) {
    devLog("insertChildLevelRewardTable error:", error)
    throw new DatabaseError("子供のレベル別報酬テーブルの作成に失敗しました。")
  }
}
