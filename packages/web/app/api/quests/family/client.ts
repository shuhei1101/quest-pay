import queryString from "query-string"
import { handleAPIError } from "@/app/(core)/errorHandler";
import { FAMILY_QUESTS_API_URL } from "@/app/(core)/constants";
import { FamilyQuestSearchParams, QuestsFamilyGetResponseSchema, QuestsFamilyPostRequest } from "./schema";

/** 家族クエストをGETする */
export const questsFamilyGet = async (params: FamilyQuestSearchParams) => {

  // クエリストリングを生成する
  const qs = queryString.stringify(params, { arrayFormat: "none" })
  
  // APIを実行する
  const res = await fetch(`${FAMILY_QUESTS_API_URL}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
  const data = await res.json()

  console.log("クエスト取得レスポンス: ", JSON.stringify(data))

  return QuestsFamilyGetResponseSchema.parse(data)
}

/** 家族クエストをPOSTする */
export const questsFamilyPost = async (request: QuestsFamilyPostRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUESTS_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
}
