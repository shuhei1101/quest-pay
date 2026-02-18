"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getRewardHistories, startPayment, completePayment } from "@/app/api/children/[id]/rewards/client"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"

/** 報酬履歴を取得する */
export const useRewardHistory = ({ childId, yearMonth }: { childId: string, yearMonth?: string }) => {
  const router = useRouter()

  const { error, data, isLoading } = useQuery({
    queryKey: ["RewardHistory", childId, yearMonth],
    retry: false,
    queryFn: () => getRewardHistories({ childId, yearMonth }),
    enabled: !!childId
  })

  if (error) handleAppError(error, router)

  return {
    histories: data?.histories || [],
    monthlyStats: data?.monthlyStats || [],
    isLoading
  }
}

/** 支払いを開始する */
export const useStartPayment = ({ childId }: { childId: string }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: ({ yearMonth }: { yearMonth: string }) => startPayment({ childId, yearMonth }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RewardHistory", childId] })
      appStorage.feedbackMessage.set({ message: "支払いを開始しました。", type: "success" })
      router.refresh()
    },
    onError: (error) => handleAppError(error, router)
  })

  return {
    startPayment: mutate,
    isStarting: isPending
  }
}

/** 支払いを完了する */
export const useCompletePayment = ({ childId }: { childId: string }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: ({ yearMonth }: { yearMonth: string }) => completePayment({ childId, yearMonth }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RewardHistory", childId] })
      appStorage.feedbackMessage.set({ message: "支払いを完了しました。", type: "success" })
      router.refresh()
    },
    onError: (error) => handleAppError(error, router)
  })

  return {
    completePayment: mutate,
    isCompleting: isPending
  }
}
