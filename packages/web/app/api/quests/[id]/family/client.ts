import { FAMILY_QUEST_API_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { DeleteFamilyQuestRequest, GetFamilyQuestResponseScheme, PutFamilyQuestRequest } from "./scheme";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";


/** 家族クエストを取得する */
export const getFamilyQuest = async (questId: string) => {
  devLog("getFamilyQuest.API呼び出し: ", {URL: FAMILY_QUEST_API_URL(questId)})
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(questId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getFamilyQuest.取得データ: ", `${FAMILY_QUEST_API_URL(questId)}`)

  const data = await res.json()

  return GetFamilyQuestResponseScheme.parse(data)
}

/** 家族クエストを更新する */
export const putFamilyQuest = async (request: PutFamilyQuestRequest) => {
  devLog("putFamilyQuest.API呼び出し: ", {URL: FAMILY_QUEST_API_URL(request.questId), request})
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(request.questId)}`, {
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
export const deleteFamilyQuest = async (request: DeleteFamilyQuestRequest) => {
  devLog("deleteFamilyQuest.API呼び出し: ", {URL: FAMILY_QUEST_API_URL(request.questId), request})
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_API_URL(request.questId)}`, {
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
