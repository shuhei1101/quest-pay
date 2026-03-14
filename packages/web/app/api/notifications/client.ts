import { NOTIFICATIONS_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"
import type { GetNotificationsResponse } from "./route"

/** 通知一覧を取得する */
export const getNotifications = async () => {
  logger.debug("通知一覧取得API呼び出し", { URL: NOTIFICATIONS_API_URL })
  const res = await fetch(NOTIFICATIONS_API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()

  return data as GetNotificationsResponse
}
