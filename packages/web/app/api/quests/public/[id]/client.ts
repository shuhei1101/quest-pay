import { PUBLIC_QUEST_API_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { DeletePublicQuestRequest, GetPublicQuestResponse, PutPublicQuestRequest } from "./route";


/** 公開クエストを取得する */
export const getPublicQuest = async ({publicQuestId}: {
  publicQuestId: string
}) => {
  devLog("getPublicQuest.API呼び出し: ", {URL: PUBLIC_QUEST_API_URL(publicQuestId)})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_API_URL(publicQuestId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getPublicQuest.取得データ: ", `${PUBLIC_QUEST_API_URL(publicQuestId)}`)

  const data = await res.json()

  return data as GetPublicQuestResponse
}

/** 公開クエストを更新する */
export const putPublicQuest = async ({request, publicQuestId}: {
  request: PutPublicQuestRequest,
  publicQuestId: string
}) => {
  devLog("putPublicQuest.API呼び出し: ", {URL: PUBLIC_QUEST_API_URL(publicQuestId), request})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_API_URL(publicQuestId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

// 公開クエストを削除する
export const deletePublicQuest = async ({request, publicQuestId}: {
  request: DeletePublicQuestRequest,
  publicQuestId: string
}) => {
  devLog("deletePublicQuest.API呼び出し: ", {URL: PUBLIC_QUEST_API_URL(publicQuestId), request})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_API_URL(publicQuestId)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
