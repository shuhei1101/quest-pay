"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PublicQuestFormType } from "../form"
import toast from "react-hot-toast"
import { putPublicQuest } from "@/app/api/quests/public/[id]/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 更新ボタン押下時のハンドル */
export const useUpdatePublicQuest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 更新処理 */
  const mutation = useMutation({
    mutationFn: ({form, publicQuestId, updatedAt}: {form: PublicQuestFormType, publicQuestId: string, updatedAt: string}) => putPublicQuest({
      request: {
        form,
        updatedAt
      },
      publicQuestId
    }),
    onSuccess: (_data, variables) => {
      // 公開クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["publicQuest", variables.publicQuestId] })
      
      // フィードバックメッセージを表示する
      toast('クエストを更新しました', {duration: 1500})
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 更新ハンドル */
  const handleUpdate = ({form, publicQuestId, updatedAt}: {form: PublicQuestFormType, publicQuestId?: string, updatedAt?: string}) => {
    if (!publicQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('更新します。よろしいですか？')) return
    mutation.mutate({form, publicQuestId, updatedAt})
  }

  return {
    handleUpdate,
    isLoading: mutation.isPending,
  }
  
}
