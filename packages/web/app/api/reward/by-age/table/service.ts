import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { fetchFamilyAgeRewardTable } from "./query"
import { insertFamilyAgeRewardTable } from "./db"
import { insertDefaultAgeRewards } from "../db"

/** 家族の年齢別報酬テーブルを取得または作成する */
export const getOrCreateFamilyAgeRewardTable = async ({
  db,
  familyId
}: {
  db: Db
  familyId: string
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 年齢別報酬テーブルを取得する
      let table = await fetchFamilyAgeRewardTable({ db: tx, familyId })

      // テーブルが存在しない場合は作成する
      if (!table) {
        table = await insertFamilyAgeRewardTable({ db: tx, familyId })
        await insertDefaultAgeRewards({ db: tx, ageRewardTableId: table.id })
      }

      return table
    })
  } catch (error) {
    devLog("getOrCreateFamilyAgeRewardTable error:", error)
    throw new DatabaseError("年齢別報酬テーブルの取得または作成に失敗しました。")
  }
}
