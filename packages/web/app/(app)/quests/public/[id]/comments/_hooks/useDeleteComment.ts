"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { deletePublicQuestComment } from "@/app/api/quests/public/[id]/comments/[commentId]/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントを削除する */
export const useDeleteComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({ publicQuestId, commentId }: { publicQuestId: string; commentId: string }) =>
      deletePublicQuestComment({ publicQuestId, commentId }),
    onSuccess: (_data, variables) => {
      toast.success("コメントを削除しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
      queryClient.invalidateQueries({ queryKey: ["publicQuestCommentsCount", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleDelete = ({
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

  return { handleDelete, isLoading: mutation.isPending }
}
