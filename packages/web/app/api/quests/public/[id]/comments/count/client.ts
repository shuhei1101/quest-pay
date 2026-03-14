import { PUBLIC_QUEST_COMMENTS_COUNT_API_URL } from "@/app/(core)/endpoints"
import { GetPublicQuestCommentsCountResponse } from "./route"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"

/** コメント数を取得する */
export const getPublicQuestCommentsCount = async ({ publicQuestId }: { publicQuestId: string }) => {
  logger.debug("getPublicQuestCommentsCount.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENTS_COUNT_API_URL(publicQuestId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENTS_COUNT_API_URL(publicQuestId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()
  logger.debug("getPublicQuestCommentsCount.取得データ: ", { data })

  return data as GetPublicQuestCommentsCountResponse
}
