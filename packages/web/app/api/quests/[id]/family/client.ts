import { handleAPIError } from "@/app/(core)/errorHandler";
import { FAMILY_QUEST_API_URL, QUESTS_API_URL } from "@/app/(core)/constants";
import { FamilyQuestDeleteRequest, FamilyQuestGetResponseSchema, FamilyQuestPutRequest } from "./schema";


/** 家族クエストを取得する */
export const getFamilyQuest = async (questId: number) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(questId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  return FamilyQuestGetResponseSchema.parse(res)
}

/** 家族クエストを更新する */
export const putFamilyQuest = async (req: FamilyQuestPutRequest) => {
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
export const deleteFamilyQuest = async (req: FamilyQuestDeleteRequest) => {
  // APIを実行する
  const res = await fetch(`${QUESTS_API_URL}/${req.quest.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
}
