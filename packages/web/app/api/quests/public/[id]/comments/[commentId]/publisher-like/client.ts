import { PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"

/** コメントに公開者いいねを付ける */
export const likePublicQuestCommentByPublisher = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("likePublicQuestCommentByPublisher.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(publicQuestId, commentId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

/** コメントの公開者いいねを解除する */
export const unlikePublicQuestCommentByPublisher = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("unlikePublicQuestCommentByPublisher.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(publicQuestId, commentId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
