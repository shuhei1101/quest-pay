"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"
import { readNotifications } from "@/app/api/notifications/read/client"
import toast from "react-hot-toast"

/** 複数の通知を既読にする */
export const useReadNotifications = () => {
  const router = useRouter()
  
  /** 既読処理 */
  const mutation = useMutation({
    mutationFn: ({
      notificationIds, 
      updatedAt,
      showSuccessMessage
    }: {
      notificationIds: string[]
      updatedAt: string
      showSuccessMessage?: boolean
    }) => readNotifications({
      request: {
        notificationIds,
        updatedAt
      }
    }),
    onSuccess: (data, variables) => {
      // 通知をリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      // 全て既読の場合のみトースト通知を表示する
      if (variables.showSuccessMessage) {
        toast.success("全ての通知を既読にしました")
      }
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 既読ハンドル */
  const handleReadNotifications = ({
    notificationIds, 
    updatedAt,
    showSuccessMessage = false
  }: {
    notificationIds: string[]
    updatedAt: string
    showSuccessMessage?: boolean
  }) => {
    mutation.mutate({notificationIds, updatedAt, showSuccessMessage})
  }

  return {
    handleReadNotifications,
    isLoading: mutation.isPending,
  }
}
