import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"
import type { ReadNotificationsRequest } from "./route"

/** 複数の通知を既読にする */
export const readNotifications = async ({request}: {
  request: ReadNotificationsRequest,
}) => {
  logger.debug("通知既読化API呼び出し", { URL: `/api/notifications/read`, request })
  // APIを実行する
  const res = await fetch(`/api/notifications/read`, {
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
