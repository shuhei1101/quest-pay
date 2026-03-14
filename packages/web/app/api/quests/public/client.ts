import queryString from "query-string"
import { PUBLIC_QUESTS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetPublicQuestsResponse } from "./route";
import { PublicQuestSearchParams } from "./query";

/** 公開クエストをGETする */
export const getPublicQuests = async (params: PublicQuestSearchParams) => {

  // クエリストリングを生成する
  const qs = queryString.stringify(params, { arrayFormat: "none" })
  
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUESTS_API_URL}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }


  return data as GetPublicQuestsResponse
}
