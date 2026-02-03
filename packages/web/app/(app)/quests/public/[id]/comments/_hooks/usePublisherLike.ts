"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { likePublicQuestCommentByPublisher, unlikePublicQuestCommentByPublisher } from "@/app/api/quests/public/[id]/comments/[commentId]/publisher-like/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントに公開者いいねを付ける */
export const usePublisherLike = () => {
  const router = useRouter()
  
  const likeMutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      likePublicQuestCommentByPublisher({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("公開者いいねしました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const unlikeMutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      unlikePublicQuestCommentByPublisher({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("公開者いいね解除しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleLike = ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    likeMutation.mutate(
      { publicQuestId, commentId },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  const handleUnlike = ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    unlikeMutation.mutate(
      { publicQuestId, commentId },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return {
    handleLike,
    handleUnlike,
    isLoading: likeMutation.isPending || unlikeMutation.isPending,
  }
}
