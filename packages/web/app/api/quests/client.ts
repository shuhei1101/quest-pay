import queryString from "query-string"
import { handleAPIError } from "@/app/(core)/errorHandler";
import { QUESTS_API_URL } from "@/app/(core)/constants";
import { QuestSearchParams, QuestsGetResponseSchema, QuestsPostRequest } from "./schema";

export const questsGet = async (params: QuestSearchParams) => {

  // クエリストリングを生成する
  const qs = queryString.stringify(params, { arrayFormat: "none" })
  
  // APIを実行する
  const res = await fetch(`${QUESTS_API_URL}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  return QuestsGetResponseSchema.parse(res)
}
export const questsPost = async (request: QuestsPostRequest) => {
  // APIを実行する
  const res = await fetch(`${QUESTS_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
}
