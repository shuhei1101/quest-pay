"use client"

import { PUBLIC_QUEST_COMMENT_REPORT_API_URL } from "@/app/(core)/endpoints"
import { PostCommentReportRequest } from "@/app/api/quests/public/[id]/comments/[commentId]/report/route"
import toast from "react-hot-toast"

/** コメントを報告する */
export const useReportComment = () => {
  const handleReport = async ({
    publicQuestId,
    commentId,
    reason,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    reason: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_REPORT_API_URL(publicQuestId, commentId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason } as PostCommentReportRequest),
      })

      if (!response.ok) {
        throw new Error("報告に失敗しました")
      }

      toast.success("報告しました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("報告に失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  return { handleReport }
}
