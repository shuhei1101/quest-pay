import { handleAPIError } from "@/app/(core)/errorHandler";
import { FAMILY_QUEST_API_URL, QUESTS_API_URL } from "@/app/(core)/constants";
import { DeleteFamilyQuestRequest, GetFamilyQuestResponseSchema, PutFamilyQuestRequest } from "./schema";
import { devLog } from "@/app/(core)/util";


/** 家族クエストを取得する */
export const getFamilyQuest = async (questId: string) => {
  devLog("getFamilyQuest.実行API: ", `${FAMILY_QUEST_API_URL(questId)}`)
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(questId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  devLog("getFamilyQuest.取得データ: ", `${FAMILY_QUEST_API_URL(questId)}`)

  const data = await res.json()

  return GetFamilyQuestResponseSchema.parse(data)
}

/** 家族クエストを更新する */
export const putFamilyQuest = async (req: PutFamilyQuestRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(req.quest.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
}

// 家族クエストを削除する
export const deleteFamilyQuest = async (req: DeleteFamilyQuestRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(req.quest.id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
}
