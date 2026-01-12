"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"
import { cancelReview } from "@/app/api/quests/family/[id]/cancel-review/client"
import toast from "react-hot-toast"
import { useState } from "react"

/** 完了報告キャンセルボタン押下時のハンドル */
export const useCancelReview = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<{familyQuestId: string, updatedAt: string} | null>(null)
  
  /** 完了報告キャンセル処理 */
  const mutation = useMutation({
    mutationFn: ({familyQuestId, updatedAt, requestMessage}: {familyQuestId: string, updatedAt: string, requestMessage?: string}) => cancelReview({
      familyQuestId,
      request: {
        updatedAt,
        requestMessage
      }
    }),
    onSuccess: (_data, variables) => {
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["childQuest", variables.familyQuestId] })

      // 画面で表示する成功メッセージを登録
      toast.success("クエストの完了報告をキャンセルしました")
      
      // モーダルを閉じる
      setIsModalOpen(false)
      setPendingRequest(null)
    },
    onError: (error) => {
      handleAppError(error, router)
      setIsModalOpen(false)
      setPendingRequest(null)
    }
  })

  /** 完了報告キャンセルハンドル */
  const handleCancelReview = ({familyQuestId, updatedAt}: {familyQuestId?: string, updatedAt?: string}) => {
    if (!familyQuestId || !updatedAt) throw new ClientValueError()
    setPendingRequest({familyQuestId, updatedAt})
    setIsModalOpen(true)
  }

  /** 完了報告キャンセルを実行する */
  const executeCancelReview = ({requestMessage}: {requestMessage?: string}) => {
    if (!pendingRequest) return
    mutation.mutate({
      familyQuestId: pendingRequest.familyQuestId,
      updatedAt: pendingRequest.updatedAt,
      requestMessage
    })
  }

  /** モーダルを閉じる */
  const closeModal = () => {
    setIsModalOpen(false)
    setPendingRequest(null)
  }

  return {
    handleCancelReview,
    executeCancelReview,
    closeModal,
    isModalOpen,
    isLoading: mutation.isPending,
  }
  
}
