"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { upvoteComment } from "@/app/api/quests/public/[id]/comments/[commentId]/upvote/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントに高評価を付ける */
export const useUpvoteComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      upvoteComment({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("高評価しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleUpvote = ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    mutation.mutate(
      { publicQuestId, commentId },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return { handleUpvote, isLoading: mutation.isPending }
}
