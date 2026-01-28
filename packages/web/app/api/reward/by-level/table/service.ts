import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { fetchFamilyLevelRewardTable } from "./query"
import { insertFamilyLevelRewardTable } from "./db"
import { insertDefaultLevelRewards } from "../db"

/** 家族のレベル別報酬テーブルを取得または作成する */
export const getOrCreateFamilyLevelRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}) => {
  try {
    return await db.transaction(async (tx) => {
      // レベル別報酬テーブルを取得する
      let table = await fetchFamilyLevelRewardTable({ db: tx, familyId })

      // テーブルが存在しない場合は作成する
      if (!table) {
        table = await insertFamilyLevelRewardTable({ db: tx, familyId })
        await insertDefaultLevelRewards({ db: tx, levelRewardTableId: table.id })
      }

      return table
    })
  } catch (error) {
    devLog("getOrCreateFamilyLevelRewardTable error:", error)
    throw new DatabaseError("レベル別報酬テーブルの取得または作成に失敗しました。")
  }
}
