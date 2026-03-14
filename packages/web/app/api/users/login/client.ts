import { LOGIN_USER_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"
import type { GetLoginUserResponse } from "./route"

export const getLoginUser = async () => {
  logger.debug("ログインユーザ取得API呼び出し", { url: LOGIN_USER_API_URL })
  // APIを実行する
  const res = await fetch(`${LOGIN_USER_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
  const data = await res.json()

  return data as GetLoginUserResponse
}
