import { PUBLIC_QUEST_COMMENT_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"

/** コメントを削除する */
export const deletePublicQuestComment = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
