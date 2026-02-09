import { FAMILY_TIMELINE_API_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyTimelinesResponse } from "./route"

/** 家族タイムラインを取得する */
export const getFamilyTimelines = async () => {
  devLog("getFamilyTimelines.API呼び出し: ", {URL: FAMILY_TIMELINE_API_URL})
  // APIを実行する
  const res = await fetch(`${FAMILY_TIMELINE_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getFamilyTimelines.取得データ: ", `${FAMILY_TIMELINE_API_URL}`)

  const data = await res.json()

  return data as GetFamilyTimelinesResponse
}
