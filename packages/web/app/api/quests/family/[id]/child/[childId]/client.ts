import { CHILD_QUEST_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildQuestResponse } from "./route";


/** 子供クエストを取得する */
export const getChildQuest = async ({familyQuestId, childId}: {
  familyQuestId: string
  childId: string
}) => {
  devLog("getChildQuest.API呼び出し: ", {URL: CHILD_QUEST_API_URL(familyQuestId, childId)})
  // APIを実行する
  const res = await fetch(`${CHILD_QUEST_API_URL(familyQuestId, childId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getChildQuest.取得データ: ", res)

  const data = await res.json()

  return data as GetChildQuestResponse
}
