import { FAMILY_AGE_REWARD_TABLE_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyAgeRewardTableResponse, PutFamilyAgeRewardTableRequest } from "./route"

/** 家族の年齢別報酬テーブルを取得する */
export const getFamilyAgeRewardTable = async () => {
  // APIを実行する
  const res = await fetch(`${FAMILY_AGE_REWARD_TABLE_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)


  return data as GetFamilyAgeRewardTableResponse
}

/** 家族の年齢別報酬テーブルを更新する */
export const putFamilyAgeRewardTable = async (request: PutFamilyAgeRewardTableRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_AGE_REWARD_TABLE_API_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

}
