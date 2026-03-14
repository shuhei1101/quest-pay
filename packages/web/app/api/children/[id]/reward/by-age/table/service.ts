import { DatabaseError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"
import { Db } from "@/index"
import { fetchChildAgeRewardTable } from "./query"
import { insertChildAgeRewardTable } from "./db"
import { insertDefaultAgeRewards } from "@/app/api/reward/by-age/db"
import { updateFamilyAgeRewards } from "@/app/api/reward/by-age/service"

/** 子供の年齢別報酬テーブルを取得または作成する */
export const getOrCreateChildAgeRewardTable = async ({
  db,
  childId
}: {
  db: Db
  childId: string
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 年齢別報酬テーブルを取得する
      let table = await fetchChildAgeRewardTable({ db: tx, childId })

      // テーブルが存在しない場合は作成する
      if (!table) {
        table = await insertChildAgeRewardTable({ db: tx, childId })
        await insertDefaultAgeRewards({ db: tx, ageRewardTableId: table.id, type: "child" })
      }

      return table
    })
  } catch (error) {
    logger.error("getOrCreateChildAgeRewardTable error", { error })
    throw new DatabaseError("子供の年齢別報酬テーブルの取得または作成に失敗しました。")
  }
}

/** 子供の年齢別報酬を一括更新する */
export const updateAgeRewards = updateFamilyAgeRewards
