"use client"

import { PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** コメントに公開者いいねを付ける */
export const usePublisherLike = () => {
  const handleLike = async ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(publicQuestId, commentId), {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("公開者いいねに失敗しました")
      }

      toast.success("公開者いいねしました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("公開者いいねに失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  const handleUnlike = async ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(publicQuestId, commentId), {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("公開者いいね解除に失敗しました")
      }

      toast.success("公開者いいね解除しました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("公開者いいね解除に失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  return { handleLike, handleUnlike }
}
