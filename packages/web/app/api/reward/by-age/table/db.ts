import { DatabaseError } from "@/app/(core)/error/appError"
import { familyAgeRewardTables } from "@/drizzle/schema"
import { Db } from "@/index"

/** 年齢別報酬テーブルを作成する */
export const insertFamilyAgeRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}) => {
  try {
    const [newTable] = await db
      .insert(familyAgeRewardTables)
      .values({ familyId })
      .returning()
    
    return newTable
  } catch (error) {
    throw new DatabaseError("年齢別報酬テーブルの作成に失敗しました。")
  }
}
