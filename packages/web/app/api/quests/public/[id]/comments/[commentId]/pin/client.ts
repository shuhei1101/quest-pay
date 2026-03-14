import { PUBLIC_QUEST_COMMENT_PIN_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"

/** コメントをピン留めする */
export const pinPublicQuestComment = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("pinPublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_PIN_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_PIN_API_URL(publicQuestId, commentId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

/** コメントのピン留めを解除する */
export const unpinPublicQuestComment = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("unpinPublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_PIN_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_PIN_API_URL(publicQuestId, commentId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
