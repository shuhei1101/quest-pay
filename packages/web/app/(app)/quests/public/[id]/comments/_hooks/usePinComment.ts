"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { pinComment, unpinComment } from "@/app/api/quests/public/[id]/comments/[commentId]/pin/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントをピン留めする */
export const usePinComment = () => {
  const router = useRouter()
  
  const pinMutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      pinComment({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("ピン留めしました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const unpinMutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      unpinComment({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("ピン留め解除しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handlePin = ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    pinMutation.mutate(
      { publicQuestId, commentId },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  const handleUnpin = ({
    publicQuestId,
    commentId,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    onSuccess?: () => void
  }) => {
    unpinMutation.mutate(
      { publicQuestId, commentId },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return {
    handlePin,
    handleUnpin,
    isLoading: pinMutation.isPending || unpinMutation.isPending,
  }
}
