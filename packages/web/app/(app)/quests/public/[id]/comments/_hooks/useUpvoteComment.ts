"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { upvotePublicQuestComment, removePublicQuestCommentUpvote } from "@/app/api/quests/public/[id]/comments/[commentId]/upvote/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントに高評価を付ける・取り消す（トグル） */
export const useUpvoteComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ 
      publicQuestId, 
      commentId, 
      isUpvoted 
    }: { 
      publicQuestId: string
      commentId: string
      isUpvoted: boolean
    }) => {
      // 既に高評価済みの場合は取り消し、そうでない場合は高評価を付ける
      if (isUpvoted) {
        return removePublicQuestCommentUpvote({ publicQuestId, commentId })
      } else {
        return upvotePublicQuestComment({ publicQuestId, commentId })
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.isUpvoted) {
        toast.success("高評価を取り消しました", { duration: 2000 })
      } else {
        toast.success("高評価しました", { duration: 2000 })
      }
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleUpvote = ({
    publicQuestId,
    commentId,
    isUpvoted,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    isUpvoted: boolean
    onSuccess?: () => void
  }) => {
    mutation.mutate(
      { publicQuestId, commentId, isUpvoted },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return { handleUpvote, isLoading: mutation.isPending }
}
