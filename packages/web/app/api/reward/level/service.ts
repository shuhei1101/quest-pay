import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { fetchFamilyLevelRewardTable } from "./query"
import { insertFamilyLevelRewardTable, insertDefaultLevelRewards, updateLevelReward } from "./db"

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
      let levelRewardTable = await fetchFamilyLevelRewardTable({ db: tx, familyId })

      // テーブルが存在しない場合は作成する
      if (!levelRewardTable) {
        const newTable = await insertFamilyLevelRewardTable({ db: tx, familyId })
        await insertDefaultLevelRewards({ db: tx, levelRewardTableId: newTable.id })
        
        // 再度取得する
        levelRewardTable = await fetchFamilyLevelRewardTable({ db: tx, familyId })
        if (!levelRewardTable) throw new DatabaseError("レベル別報酬テーブルの取得に失敗しました。")
      }

      return levelRewardTable
    })
  } catch (error) {
    devLog("getOrCreateFamilyLevelRewardTable error:", error)
    throw new DatabaseError("レベル別報酬テーブルの取得または作成に失敗しました。")
  }
}

/** 家族のレベル別報酬を一括更新する */
export const updateFamilyLevelRewards = async ({
  db,
  levelRewardTableId,
  rewards
}: {
  db: Db
  levelRewardTableId: string
  rewards: Array<{ level: number; amount: number }>
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 報酬を更新する
      for (const reward of rewards) {
        await updateLevelReward({
          db: tx,
          levelRewardTableId,
          level: reward.level,
          amount: reward.amount
        })
      }
    })
  } catch (error) {
    devLog("updateFamilyLevelRewards error:", error)
    throw new DatabaseError("レベル別報酬の更新に失敗しました。")
  }
}
