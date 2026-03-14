import { TEMPLATE_QUEST_API_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { logger } from "@/app/(core)/logger";
import { AppError } from "@/app/(core)/error/appError";
import type { DeleteTemplateQuestRequest, GetTemplateQuestResponse, PutTemplateQuestRequest } from "./route";


/** テンプレートクエストを取得する */
export const getTemplateQuest = async ({templateQuestId}: {
  templateQuestId: string
}) => {
  logger.debug("getTemplateQuest.API呼び出し: ", {URL: TEMPLATE_QUEST_API_URL(templateQuestId })})
  // APIを実行する
  const res = await fetch(`${TEMPLATE_QUEST_API_URL(templateQuestId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  logger.debug("getTemplateQuest.取得データ: ", { `${TEMPLATE_QUEST_API_URL(templateQuestId })}`)

  const data = await res.json()

  return data as GetTemplateQuestResponse
}

/** テンプレートクエストを更新する */
export const putTemplateQuest = async ({request, templateQuestId}: {
  request: PutTemplateQuestRequest,
  templateQuestId: string
}) => {
  logger.debug("putTemplateQuest.API呼び出し: ", {URL: TEMPLATE_QUEST_API_URL(templateQuestId }), request})
  // APIを実行する
  const res = await fetch(`${TEMPLATE_QUEST_API_URL(templateQuestId)}`, {
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

// テンプレートクエストを削除する
export const deleteTemplateQuest = async ({request, templateQuestId}: {
  request: DeleteTemplateQuestRequest,
  templateQuestId: string
}) => {
  logger.debug("deleteTemplateQuest.API呼び出し: ", {URL: TEMPLATE_QUEST_API_URL(templateQuestId }), request})
  // APIを実行する
  const res = await fetch(`${TEMPLATE_QUEST_API_URL(templateQuestId)}`, {
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
