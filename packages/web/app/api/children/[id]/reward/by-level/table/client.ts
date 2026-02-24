import { CHILD_LEVEL_REWARD_TABLE_API_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import { GetChildLevelRewardTableResponse, PutChildLevelRewardTableRequest } from "./route"

/** 子供のレベル別報酬テーブルを取得する */
export const getChildLevelRewardTable = async (childId: string) => {
  const url = CHILD_LEVEL_REWARD_TABLE_API_URL(childId)
  devLog("getChildLevelRewardTable.API呼び出し: ", { URL: url, childId })
  // APIを実行する
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)

  devLog("getChildLevelRewardTable.戻り値: ", data)

  return data as GetChildLevelRewardTableResponse
}

/** 子供のレベル別報酬テーブルを更新する */
export const putChildLevelRewardTable = async (childId: string, request: PutChildLevelRewardTableRequest) => {
  const url = CHILD_LEVEL_REWARD_TABLE_API_URL(childId)
  devLog("putChildLevelRewardTable.API呼び出し: ", { URL: url, childId, request })
  // APIを実行する
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("putChildLevelRewardTable.完了")
}
