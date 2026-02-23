import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { childAgeRewardTables } from "@/drizzle/schema"
import { Db } from "@/index"

/** 子供の年齢別報酬テーブルを作成する */
export const insertChildAgeRewardTable = async ({
  db,
  childId
}: {
  db: Db
  childId: string
}) => {
  try {
    const result = await db
      .insert(childAgeRewardTables)
      .values({ childId })
      .returning()
    
    return result[0]
  } catch (error) {
    devLog("insertChildAgeRewardTable error:", error)
    throw new DatabaseError("子供の年齢別報酬テーブルの作成に失敗しました。")
  }
}
