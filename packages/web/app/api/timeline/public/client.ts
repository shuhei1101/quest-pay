import { PUBLIC_TIMELINE_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"
import type { GetPublicTimelinesResponse } from "./route"

/** 公開タイムラインを取得する */
export const getPublicTimelines = async () => {
  logger.debug("getPublicTimelines.API呼び出し: ", {URL: PUBLIC_TIMELINE_API_URL} })
  // APIを実行する
  const res = await fetch(`${PUBLIC_TIMELINE_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  logger.debug("getPublicTimelines.取得データ: ", { PUBLIC_TIMELINE_API_URL })

  const data = await res.json()

  return data as GetPublicTimelinesResponse
}
