"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FamilyQuestFormType } from "../form"
import toast from "react-hot-toast"
import { putFamilyQuest } from "@/app/api/quests/family/[id]/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 更新ボタン押下時のハンドル */
export const useUpdateFamilyQuest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 更新処理 */
  const mutation = useMutation({
    mutationFn: ({form, familyQuestId, updatedAt}: {form: FamilyQuestFormType, familyQuestId: string, updatedAt: string}) => putFamilyQuest({
      request: {
        form,
        updatedAt
      },
      familyQuestId
    }),
    onSuccess: (_data, variables) => {
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["familyQuest", variables.familyQuestId] })
      // フィードバックメッセージを表示する
      toast('クエストを更新しました', {duration: 1500})
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 更新ハンドル */
  const handleUpdate = ({form, familyQuestId, updatedAt}: {form: FamilyQuestFormType, familyQuestId?: string, updatedAt?: string}) => {
    if (!familyQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('更新します。よろしいですか？')) return
    mutation.mutate({form, familyQuestId, updatedAt})
  }

  return {
    handleUpdate,
    isLoading: mutation.isPending,
  }
  
}
