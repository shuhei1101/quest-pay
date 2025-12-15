"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FamilyQuestFormType } from "../form"
import toast from "react-hot-toast"
import { putFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { PutFamilyQuestRequest } from "@/app/api/quests/[id]/family/scheme"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 更新ボタン押下時のハンドル */
export const useUpdateFamilyQuest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 更新処理 */
  const mutation = useMutation({
    mutationFn: ({req}: {req: PutFamilyQuestRequest}) => putFamilyQuest(req),
    onSuccess: (_data, variables) => {
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["familyQuest", variables.req.questId] })
      // フィードバックメッセージを表示する
      toast('クエストを更新しました', {duration: 1500})
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 更新ハンドル */
  const handleUpdate = ({form, questId, updatedAt}: {form: FamilyQuestFormType, questId?: string, updatedAt?: string}) => {
    if (!questId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('更新します。よろしいですか？')) return
    mutation.mutate({req: {form, questId, updatedAt}})
  }

  return {
    handleUpdate,
    isLoading: mutation.isPending,
  }
    
}
