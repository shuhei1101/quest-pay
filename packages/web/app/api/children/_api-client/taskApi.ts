import { handleAPIError } from "@/app/(core)/errorHandler";
import { QUESTS_API_URL, FAMILY_QUESTS_API_URL } from "@/app/(core)/constants";
import { RegisterQuestRequest, UpdateQuestRequest } from "../../../children/api/schema";

export const questApi = {
  /** クエストを作成する */
  create: async (request: RegisterQuestRequest) => {
    const res = await fetch(`${FAMILY_QUESTS_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** クエストを更新する */
  update: async (request: UpdateQuestRequest) => {
    const res = await fetch(`${FAMILY_QUESTS_API_URL}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** クエストを削除する */
  delete: async (quest: QuestDelete) => {
    const res = await fetch(`${FAMILY_QUESTS_API_URL}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quest)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
}
