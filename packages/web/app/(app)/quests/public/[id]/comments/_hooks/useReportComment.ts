"use client"

import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { reportComment } from "@/app/api/quests/public/[id]/comments/[commentId]/report/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

/** コメントを報告する */
export const useReportComment = () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: ({
      publicQuestId,
      commentId,
      reason,
    }: {
      publicQuestId: string
      commentId: string
      reason: string
    }) => reportComment({ publicQuestId, commentId, reason }),
    onSuccess: (_data, variables) => {
      toast.success("報告しました", { duration: 2000 })
      // コメント一覧を再取得する
      queryClient.invalidateQueries({ queryKey: ["publicQuestComments", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router),
  })

  const handleReport = ({
    publicQuestId,
    commentId,
    reason,
    onSuccess,
  }: {
    publicQuestId: string
    commentId: string
    reason: string
    onSuccess?: () => void
  }) => {
    mutation.mutate(
      { publicQuestId, commentId, reason },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return { handleReport, isLoading: mutation.isPending }
}
