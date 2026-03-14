import { CHILD_QUEST_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildQuestResponse } from "./route";


/** 子供クエストを取得する */
export const getChildQuest = async ({familyQuestId, childId}: {
  familyQuestId: string
  childId: string
}) => {
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


  const data = await res.json()

  return data as GetChildQuestResponse
}

/** 子供クエストを削除する（進捗リセット） */
export const deleteChildQuest = async ({familyQuestId, childId}: {
  familyQuestId: string
  childId: string
}) => {
  // APIを実行する
  const res = await fetch(`${CHILD_QUEST_API_URL(familyQuestId, childId)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

}
