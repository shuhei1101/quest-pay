"use client"

import { PUBLIC_QUEST_COMMENT_API_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** コメントを削除する */
export const useDeleteComment = () => {
  const handleDelete = async ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId), {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("削除に失敗しました")
      }

      toast.success("コメントを削除しました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("コメントの削除に失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  return { handleDelete }
}
