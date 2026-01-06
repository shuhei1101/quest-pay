"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TemplateQuestFormType } from "../form"
import toast from "react-hot-toast"
import { putTemplateQuest } from "@/app/api/quests/template/[id]/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 更新ボタン押下時のハンドル */
export const useUpdateTemplateQuest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 更新処理 */
  const mutation = useMutation({
    mutationFn: ({form, templateQuestId, updatedAt}: {form: TemplateQuestFormType, templateQuestId: string, updatedAt: string}) => putTemplateQuest({
      request: {
        form,
        updatedAt
      },
      templateQuestId
    }),
    onSuccess: (_data, variables) => {
      // テンプレートクエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["templateQuest", variables.templateQuestId] })
      
      // フィードバックメッセージを表示する
      toast('クエストを更新しました', {duration: 1500})
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 更新ハンドル */
  const handleUpdate = ({form, templateQuestId, updatedAt}: {form: TemplateQuestFormType, templateQuestId?: string, updatedAt?: string}) => {
    if (!templateQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('更新します。よろしいですか？')) return
    mutation.mutate({form, templateQuestId, updatedAt})
  }

  return {
    handleUpdate,
    isLoading: mutation.isPending,
  }
  
}
