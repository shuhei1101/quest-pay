"use client"

import { PUBLIC_QUEST_COMMENT_PIN_API_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** コメントをピン留めする */
export const usePinComment = () => {
  const handlePin = async ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_PIN_API_URL(publicQuestId, commentId), {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("ピン留めに失敗しました")
      }

      toast.success("ピン留めしました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("ピン留めに失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  const handleUnpin = async ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENT_PIN_API_URL(publicQuestId, commentId), {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("ピン留め解除に失敗しました")
      }

      toast.success("ピン留め解除しました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("ピン留め解除に失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  return { handlePin, handleUnpin }
}
