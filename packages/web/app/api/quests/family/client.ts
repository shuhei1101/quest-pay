import queryString from "query-string"
import { FAMILY_QUESTS_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { FamilyQuestSearchParams, GetFamilyQuestsResponse, PostFamilyQuestRequest, PostFamilyQuestResponse } from "./route";

/** 家族クエストをGETする */
export const getFamilyQuests = async (params: FamilyQuestSearchParams) => {
  devLog("getFamilyQuests.API呼び出し: ", {URL: FAMILY_QUESTS_API_URL, params})

  // クエリストリングを生成する
  const qs = queryString.stringify(params, { arrayFormat: "none" })
  
  // APIを実行する
  const res = await fetch(`${FAMILY_QUESTS_API_URL}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getFamilyQuests.戻り値: ", data)

  return data as GetFamilyQuestsResponse
}

/** 家族クエストをPOSTする */
export const postFamilyQuest = async (request: PostFamilyQuestRequest) => {
  devLog("postFamilyQuest.API呼び出し: ", {URL: FAMILY_QUESTS_API_URL, request})
  // APIを実行する
  const res = await fetch(`${FAMILY_QUESTS_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  const data = await res.json()
  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    devLog("postFamilyQuest.API例外: ", data)
    throw AppError.fromResponse(data, res.status)
  }

  devLog("postFamilyQuest.戻り値: ", data)

  return data as PostFamilyQuestResponse
}
