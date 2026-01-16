"use client"

import { PUBLIC_QUEST_COMMENTS_API_URL } from "@/app/(core)/endpoints"
import { PostPublicQuestCommentRequest } from "@/app/api/quests/public/[id]/comments/route"
import toast from "react-hot-toast"

/** コメントを投稿する */
export const usePostComment = () => {
  const handlePostComment = async ({
    publicQuestId,
    content,
    onSuccess,
  }: {
    publicQuestId: string
    content: string
    onSuccess?: () => void
  }) => {
    try {
      const response = await fetch(PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content } as PostPublicQuestCommentRequest),
      })

      if (!response.ok) {
        throw new Error("コメントの投稿に失敗しました")
      }

      toast.success("コメントを投稿しました", { duration: 2000 })
      onSuccess?.()
    } catch (error) {
      toast.error("コメントの投稿に失敗しました", { duration: 2000 })
      console.error(error)
    }
  }

  return { handlePostComment }
}
