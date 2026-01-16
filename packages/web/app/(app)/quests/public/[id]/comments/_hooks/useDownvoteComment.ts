"use client"

import { PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** コメントに低評価を付ける */
export const useDownvoteComment = () => {
  const handleDownvote = async ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL(publicQuestId, commentId), {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("低評価に失敗しました")
      }

      toast.success("低評価しました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("低評価に失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  return { handleDownvote }
}
