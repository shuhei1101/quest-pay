import { DatabaseError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { fetchChildLevelRewardTable } from "./query"
import { insertChildLevelRewardTable } from "./db"
import { insertDefaultLevelRewards } from "@/app/api/reward/by-level/db"
import { updateFamilyLevelRewards } from "@/app/api/reward/by-level/service"

/** 子供のレベル別報酬テーブルを取得または作成する */
export const getOrCreateChildLevelRewardTable = async ({
  db,
  childId
}: {
  db: Db
  childId: string
}) => {
  try {
    return await db.transaction(async (tx) => {
      // レベル別報酬テーブルを取得する
      let table = await fetchChildLevelRewardTable({ db: tx, childId })

      // テーブルが存在しない場合は作成する
      if (!table) {
        table = await insertChildLevelRewardTable({ db: tx, childId })
        await insertDefaultLevelRewards({ db: tx, levelRewardTableId: table.id, type: "child" })
      }

      return table
    })
  } catch (error) {
    throw new DatabaseError("子供のレベル別報酬テーブルの取得または作成に失敗しました。")
  }
}

/** 子供のレベル別報酬を一括更新する */
export const updateLevelRewards = updateFamilyLevelRewards
