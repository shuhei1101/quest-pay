import queryString from "query-string"
import { CHILD_QUESTS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildQuestsResponse } from "./route";
import { ChildQuestSearchParams } from "../../../quests/family/[id]/child/query";

/** 子供クエストをGETする */
export const getChildQuests = async ({params, childId}: {
  childId: string,
  params: ChildQuestSearchParams
}) => {

  // クエリストリングを生成する
  const qs = queryString.stringify(params, { arrayFormat: "none" })
  
  // APIを実行する
  const res = await fetch(`${CHILD_QUESTS_API_URL(childId)}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }


  return data as GetChildQuestsResponse
}
