"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { downvotePublicQuestComment, removePublicQuestCommentDownvote } from "@/app/api/quests/public/[id]/comments/[commentId]/downvote/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントに低評価を付ける・取り消す（トグル） */
export const useDownvoteComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ 
      publicQuestId, 
      commentId,
      isDownvoted
    }: { 
      publicQuestId: string
      commentId: string
      isDownvoted: boolean
    }) => {
      // 既に低評価済みの場合は取り消し、そうでない場合は低評価を付ける
      if (isDownvoted) {
        return removePublicQuestCommentDownvote({ publicQuestId, commentId })
      } else {
        return downvotePublicQuestComment({ publicQuestId, commentId })
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.isDownvoted) {
        toast.success("低評価を取り消しました", { duration: 2000 })
      } else {
        toast.success("低評価しました", { duration: 2000 })
      }
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleDownvote = ({
    publicQuestId,
    commentId,
    isDownvoted,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    isDownvoted: boolean
    onSuccess?: () => void
  }) => {
    mutation.mutate(
      { publicQuestId, commentId, isDownvoted },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return { handleDownvote, isLoading: mutation.isPending }
}
