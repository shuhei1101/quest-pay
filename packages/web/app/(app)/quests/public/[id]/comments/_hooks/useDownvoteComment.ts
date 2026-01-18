"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { downvoteComment } from "@/app/api/quests/public/[id]/comments/[commentId]/downvote/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントに低評価を付ける */
export const useDownvoteComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      downvoteComment({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("低評価しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleDownvote = ({
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

  return { handleDownvote, isLoading: mutation.isPending }
}
