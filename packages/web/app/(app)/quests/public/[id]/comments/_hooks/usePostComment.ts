"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { postPublicQuestComment } from "@/app/api/quests/public/[id]/comments/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントを投稿する */
export const usePostComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ publicQuestId, content }: { publicQuestId: string; content: string }) =>
      postPublicQuestComment({ publicQuestId, content }),
    onSuccess: (_data, variables) => {
      toast.success("コメントを投稿しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
      queryClient.invalidateQueries({ queryKey: ["publicQuestCommentsCount", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handlePostComment = ({
    publicQuestId,
    content,
    onSuccess,
  }: {
    publicQuestId: string
    content: string
    onSuccess?: () => void
  }) => {
    mutation.mutate(
      { publicQuestId, content },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return { handlePostComment, isLoading: mutation.isPending }
}
