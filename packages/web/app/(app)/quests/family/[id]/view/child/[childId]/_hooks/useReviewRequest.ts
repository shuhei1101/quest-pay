"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"
import { reviewRequest } from "@/app/api/quests/family/[id]/review-request/client"
import toast from "react-hot-toast"
import { useState } from "react"

/** 完了報告ボタン押下時のハンドル */
export const useReviewRequest = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<{familyQuestId: string, updatedAt: string} | null>(null)
  
  /** 完了報告処理 */
  const mutation = useMutation({
    mutationFn: ({familyQuestId, updatedAt, requestMessage}: {familyQuestId: string, updatedAt: string, requestMessage?: string}) => reviewRequest({
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
      toast.success("クエストを完了報告しました")
      
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

  /** 完了報告ハンドル */
  const handleReviewRequest = ({familyQuestId, updatedAt}: {familyQuestId?: string, updatedAt?: string}) => {
    if (!familyQuestId || !updatedAt) throw new ClientValueError()
    setPendingRequest({familyQuestId, updatedAt})
    setIsModalOpen(true)
  }

  /** 完了報告を実行する */
  const executeReviewRequest = ({requestMessage}: {requestMessage?: string}) => {
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
    handleReviewRequest,
    executeReviewRequest,
    closeModal,
    isModalOpen,
    isLoading: mutation.isPending,
  }
  
}
