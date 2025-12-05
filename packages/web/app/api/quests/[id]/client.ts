import { handleAPIError } from "@/app/(core)/errorHandler";
import { QUESTS_API_URL } from "@/app/(core)/constants";
import { QuestDeleteRequest, QuestGetResponseSchema, QuestPutRequest } from "./schema";


/** クエストを取得する */
export const questGet = async (id: number) => {
  // APIを実行する
  const res = await fetch(`${QUESTS_API_URL}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  return QuestGetResponseSchema.parse(res)
}

/** クエストを更新する */
export const questPut = async (req: QuestPutRequest) => {
  // APIを実行する
  const res = await fetch(`${QUESTS_API_URL}/${req.quest.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
}

// クエストを削除する
export const questDelete = async (req: QuestDeleteRequest) => {
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
