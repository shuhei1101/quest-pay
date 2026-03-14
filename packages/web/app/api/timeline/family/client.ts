import { FAMILY_TIMELINE_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyTimelinesResponse } from "./route"

/** 家族タイムラインを取得する */
export const getFamilyTimelines = async () => {
  logger.debug("家族タイムライン取得API呼び出し", { url: FAMILY_TIMELINE_API_URL })
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

  logger.debug("家族タイムライン取得完了")

  const data = await res.json()

  return data as GetFamilyTimelinesResponse
}
