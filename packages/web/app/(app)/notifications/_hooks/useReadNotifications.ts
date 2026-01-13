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
    mutationFn: ({notificationIds, updatedAt}: {notificationIds: string[], updatedAt: string}) => readNotifications({
      request: {
        notificationIds,
        updatedAt
      }
    }),
    onSuccess: () => {
      // 通知をリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      toast.success("全ての通知を既読にしました")
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 既読ハンドル */
  const handleReadNotifications = ({notificationIds, updatedAt}: {notificationIds: string[], updatedAt: string}) => {
    mutation.mutate({notificationIds, updatedAt})
  }

  return {
    handleReadNotifications,
    isLoading: mutation.isPending,
  }
}