import { FAMILY_TIMELINE_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyTimelinesResponse } from "./route"

/** 家族タイムラインを取得する */
export const getFamilyTimelines = async () => {
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


  const data = await res.json()

  return data as GetFamilyTimelinesResponse
}
