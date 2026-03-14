import { FAMILY_LEVEL_REWARD_TABLE_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyLevelRewardTableResponse, PutFamilyLevelRewardTableRequest } from "./route"

/** 家族のレベル別報酬テーブルを取得する */
export const getFamilyLevelRewardTable = async () => {
  logger.debug("getFamilyLevelRewardTable.API呼び出し: ", { URL: FAMILY_LEVEL_REWARD_TABLE_API_URL } })
  // APIを実行する
  const res = await fetch(`${FAMILY_LEVEL_REWARD_TABLE_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)

  logger.debug("getFamilyLevelRewardTable.戻り値: ", { data })

  return data as GetFamilyLevelRewardTableResponse
}

/** 家族のレベル別報酬テーブルを更新する */
export const putFamilyLevelRewardTable = async (request: PutFamilyLevelRewardTableRequest) => {
  logger.debug("putFamilyLevelRewardTable.API呼び出し: ", { URL: FAMILY_LEVEL_REWARD_TABLE_API_URL, request } })
  // APIを実行する
  const res = await fetch(`${FAMILY_LEVEL_REWARD_TABLE_API_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  logger.debug("putFamilyLevelRewardTable.完了")
}
