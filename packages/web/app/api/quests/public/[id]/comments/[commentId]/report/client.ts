import { PUBLIC_QUEST_COMMENT_REPORT_API_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import { PostCommentReportRequest } from "./route"

/** コメントを報告する */
export const reportPublicQuestComment = async ({
  publicQuestId,
  commentId,
  reason,
}: {
  publicQuestId: string
  commentId: string
  reason: string
}) => {
  devLog("reportPublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENT_REPORT_API_URL(publicQuestId, commentId) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENT_REPORT_API_URL(publicQuestId, commentId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason } as PostCommentReportRequest),
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
