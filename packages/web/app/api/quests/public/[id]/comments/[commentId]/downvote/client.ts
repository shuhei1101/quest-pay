import { PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"

/** コメントに低評価を付ける */
export const downvotePublicQuestComment = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  devLog("downvotePublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL(publicQuestId, commentId) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL(publicQuestId, commentId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

/** コメントの低評価を取り消す */
export const removePublicQuestCommentDownvote = async ({
  publicQuestId,
  commentId,
}: {
  publicQuestId: string
  commentId: string
}) => {
  devLog("removePublicQuestCommentDownvote.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL(publicQuestId, commentId) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL(publicQuestId, commentId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
