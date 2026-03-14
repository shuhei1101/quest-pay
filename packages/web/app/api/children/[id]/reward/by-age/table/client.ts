import { CHILD_AGE_REWARD_TABLE_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import { GetChildAgeRewardTableResponse, PutChildAgeRewardTableRequest } from "./route"

/** 子供の年齢別報酬テーブルを取得する */
export const getChildAgeRewardTable = async (childId: string) => {
  const url = CHILD_AGE_REWARD_TABLE_API_URL(childId)
  // APIを実行する
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)


  return data as GetChildAgeRewardTableResponse
}

/** 子供の年齢別報酬テーブルを更新する */
export const putChildAgeRewardTable = async (childId: string, request: PutChildAgeRewardTableRequest) => {
  const url = CHILD_AGE_REWARD_TABLE_API_URL(childId)
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

}
