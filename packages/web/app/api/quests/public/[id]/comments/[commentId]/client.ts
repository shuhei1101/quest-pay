import { PUBLIC_QUEST_COMMENT_API_URL } from "@/app/(core)/endpoints"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"

/** コメントを削除する */
export const deletePublicQuestComment = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  logger.debug("deletePublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
