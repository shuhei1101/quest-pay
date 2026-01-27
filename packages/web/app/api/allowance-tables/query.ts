import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { 
  familyAllowanceTables, 
  familyAllowanceByAges, 
  familyLevelTables, 
  familyLevelRewards 
} from "@/drizzle/schema"
import { eq } from "drizzle-orm"

/** 家族IDに一致するお小遣いテーブルを取得する */
export const fetchAllowanceTableByFamilyId = async ({ db, familyId }: {
  db: Db
  familyId: string
}) => {
  try {
    // お小遣いテーブルを取得する
    const allowanceTableData = await db
      .select()
      .from(familyAllowanceTables)
      .where(eq(familyAllowanceTables.familyId, familyId))
      .limit(1)

    if (!allowanceTableData[0]) {
      devLog("fetchAllowanceTableByFamilyId.お小遣いテーブルが存在しません", "app/api/allowance-tables/query.ts")
      return null
    }

    const allowanceTable = allowanceTableData[0]

    // 年齢別お小遣い額を取得する
    const allowanceByAgesData = await db
      .select()
      .from(familyAllowanceByAges)
      .where(eq(familyAllowanceByAges.allowanceTableId, allowanceTable.id))

    devLog("fetchAllowanceTableByFamilyId.取得データ: ", { allowanceTable, allowanceByAgesData }, "app/api/allowance-tables/query.ts")

    return {
      allowanceTable,
      allowanceByAges: allowanceByAgesData
    }
  } catch (error) {
    devLog("fetchAllowanceTableByFamilyId.取得例外: ", error, "app/api/allowance-tables/query.ts")
    throw new QueryError("お小遣いテーブルの読み込みに失敗しました。")
  }
}

/** 家族IDに一致するレベルテーブルを取得する */
export const fetchLevelTableByFamilyId = async ({ db, familyId }: {
  db: Db
  familyId: string
}) => {
  try {
    // レベルテーブルを取得する
    const levelTableData = await db
      .select()
      .from(familyLevelTables)
      .where(eq(familyLevelTables.familyId, familyId))
      .limit(1)

    if (!levelTableData[0]) {
      devLog("fetchLevelTableByFamilyId.レベルテーブルが存在しません", "app/api/allowance-tables/query.ts")
      return null
    }

    const levelTable = levelTableData[0]

    // レベル別報酬額を取得する
    const levelRewardsData = await db
      .select()
      .from(familyLevelRewards)
      .where(eq(familyLevelRewards.levelTableId, levelTable.id))

    devLog("fetchLevelTableByFamilyId.取得データ: ", { levelTable, levelRewardsData }, "app/api/allowance-tables/query.ts")

    return {
      levelTable,
      levelRewards: levelRewardsData
    }
  } catch (error) {
    devLog("fetchLevelTableByFamilyId.取得例外: ", error, "app/api/allowance-tables/query.ts")
    throw new QueryError("レベルテーブルの読み込みに失敗しました。")
  }
}

export type AllowanceTableData = Awaited<ReturnType<typeof fetchAllowanceTableByFamilyId>>
export type LevelTableData = Awaited<ReturnType<typeof fetchLevelTableByFamilyId>>
