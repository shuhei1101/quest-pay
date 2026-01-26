"use client"

import { getNotifications } from "@/app/api/notifications/client"
import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { useQuery } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 通知リストを取得する */
export const useNotifications = () => {
  const router = useRouter()
  
  /** 通知を取得する */
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    retry: false,
    queryFn: () => getNotifications(),
    staleTime: 0,
    refetchOnMount: "always",
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    notifications: data?.notifications ?? [],
    isLoading,
    refetch
  }
}
