import queryString from "query-string"
import { TEMPLATE_QUESTS_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"
import type { GetTemplateQuestsResponse } from "./route"
import { TemplateQuestSearchParams } from "./query"

/** テンプレートクエストをGETする */
export const getTemplateQuests = async (params: TemplateQuestSearchParams) => {
  logger.debug("テンプレートクエスト一覧取得API呼び出し", { URL: TEMPLATE_QUESTS_API_URL, params })

  // クエリストリングを生成する
  const qs = queryString.stringify(params, { arrayFormat: "none" })
  
  // APIを実行する
  const res = await fetch(`${TEMPLATE_QUESTS_API_URL}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }

  logger.debug("テンプレートクエスト一覧取得完了", { data })

  return data as GetTemplateQuestsResponse
}
