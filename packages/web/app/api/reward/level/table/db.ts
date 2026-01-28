import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { familyLevelRewardTables } from "@/drizzle/schema"
import { Db } from "@/index"

/** レベル別報酬テーブルを作成する */
export const insertFamilyLevelRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}) => {
  try {
    const [newTable] = await db
      .insert(familyLevelRewardTables)
      .values({ familyId })
      .returning()
    
    return newTable
  } catch (error) {
    devLog("insertFamilyLevelRewardTable error:", error)
    throw new DatabaseError("レベル別報酬テーブルの作成に失敗しました。")
  }
}
