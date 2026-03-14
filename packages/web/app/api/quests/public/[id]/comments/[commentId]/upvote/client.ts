import { PUBLIC_QUEST_COMMENT_UPVOTE_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"

/** コメントに高評価を付ける */
export const upvotePublicQuestComment = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("upvotePublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_UPVOTE_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_UPVOTE_API_URL(publicQuestId, commentId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

/** コメントの高評価を取り消す */
export const removePublicQuestCommentUpvote = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("removePublicQuestCommentUpvote.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_UPVOTE_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_UPVOTE_API_URL(publicQuestId, commentId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
