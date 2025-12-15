import queryString from "query-string"
import { FAMILY_QUESTS_API_URL } from "@/app/(core)/constants";
import { FamilyQuestSearchParams, GetFamilyQuestsResponseScheme, PostFamilyQuestRequest, PostFamilyQuestResponseScheme } from "./scheme";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";

/** 家族クエストをGETする */
export const getFamilyQuests = async (params: FamilyQuestSearchParams) => {

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

  return GetFamilyQuestsResponseScheme.parse(data)
}

/** 家族クエストをPOSTする */
export const postFamilyQuest = async (request: PostFamilyQuestRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUESTS_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()

  devLog("postFamilyQuest.戻り値: ", data)

  return PostFamilyQuestResponseScheme.parse(data)
}
