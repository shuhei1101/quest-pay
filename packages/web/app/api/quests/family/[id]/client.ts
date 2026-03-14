import { FAMILY_QUEST_API_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { DeleteFamilyQuestRequest, GetFamilyQuestResponse, PutFamilyQuestRequest } from "./route";


/** 家族クエストを取得する */
export const getFamilyQuest = async ({familyQuestId}: {
  familyQuestId: string
}) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(familyQuestId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // キャッシュを無効化
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()
  return data as GetFamilyQuestResponse
}

/** 家族クエストを更新する */
export const putFamilyQuest = async ({request, familyQuestId}: {
  request: PutFamilyQuestRequest,
  familyQuestId: string
}) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(familyQuestId)}`, {
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

// 家族クエストを削除する
export const deleteFamilyQuest = async ({request, familyQuestId}: {
  request: DeleteFamilyQuestRequest,
  familyQuestId: string
}) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(familyQuestId)}`, {
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
