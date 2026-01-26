"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"
import { approveReport } from "@/app/api/quests/family/[id]/child/[childId]/approve/client"
import toast from "react-hot-toast"
import { useState } from "react"

/** 報告受領ボタン押下時のハンドル */
export const useApproveReport = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<{familyQuestId: string, childId: string, updatedAt: string} | null>(null)
  
  /** 受領処理 */
  const mutation = useMutation({
    mutationFn: ({familyQuestId, childId, updatedAt, responseMessage}: {
      familyQuestId: string
      childId: string
      updatedAt: string
      responseMessage?: string
    }) => approveReport({
      familyQuestId,
      childId,
      request: {
        updatedAt,
        responseMessage
      }
    }),
    onSuccess: (_data, variables) => {
      // クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["childQuest", variables.familyQuestId] })

      // 成功メッセージを表示する
      toast.success("報告を受領しました")
      
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

  /** 受領ハンドル */
  const handleApproveReport = ({familyQuestId, childId, updatedAt}: {
    familyQuestId?: string
    childId?: string
    updatedAt?: string
  }) => {
    if (!familyQuestId || !childId || !updatedAt) throw new ClientValueError()
    setPendingRequest({familyQuestId, childId, updatedAt})
    setIsModalOpen(true)
  }

  /** 実行ハンドル */
  const executeApproveReport = (responseMessage?: string) => {
    if (!pendingRequest) return
    mutation.mutate({
      ...pendingRequest,
      responseMessage
    })
  }

  /** モーダルを閉じる */
  const closeModal = () => {
    setIsModalOpen(false)
    setPendingRequest(null)
  }

  return {
    handleApproveReport,
    executeApproveReport,
    closeModal,
    isModalOpen,
    isLoading: mutation.isPending,
  }
}
