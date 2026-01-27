import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { fetchFamilyAgeRewardTable } from "./query"
import { insertFamilyAgeRewardTable, insertDefaultAgeRewards, updateAgeReward } from "./db"

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
      let ageRewardTable = await fetchFamilyAgeRewardTable({ db: tx, familyId })

      // テーブルが存在しない場合は作成する
      if (!ageRewardTable) {
        const newTable = await insertFamilyAgeRewardTable({ db: tx, familyId })
        await insertDefaultAgeRewards({ db: tx, ageRewardTableId: newTable.id })
        
        // 再度取得する
        ageRewardTable = await fetchFamilyAgeRewardTable({ db: tx, familyId })
        if (!ageRewardTable) throw new DatabaseError("年齢別報酬テーブルの取得に失敗しました。")
      }

      return ageRewardTable
    })
  } catch (error) {
    devLog("getOrCreateFamilyAgeRewardTable error:", error)
    throw new DatabaseError("年齢別報酬テーブルの取得または作成に失敗しました。")
  }
}

/** 家族の年齢別報酬を一括更新する */
export const updateFamilyAgeRewards = async ({
  db,
  ageRewardTableId,
  rewards
}: {
  db: Db
  ageRewardTableId: string
  rewards: Array<{ age: number; amount: number }>
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 報酬を更新する
      for (const reward of rewards) {
        await updateAgeReward({
          db: tx,
          ageRewardTableId,
          age: reward.age,
          amount: reward.amount
        })
      }
    })
  } catch (error) {
    devLog("updateFamilyAgeRewards error:", error)
    throw new DatabaseError("年齢別報酬の更新に失敗しました。")
  }
}
