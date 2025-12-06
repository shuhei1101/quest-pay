"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FamilyQuestFormType } from "../form"
import toast from "react-hot-toast"
import { handleAppError } from "@/app/(core)/errorHandler"
import { putFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { ClientValueError } from "@/app/(core)/appError"

/** 更新ボタン押下時のハンドル */
export const useUpdateFamilyQuest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 更新処理 */
  const mutation = useMutation({
    mutationFn: ({form, questId, updatedAt}: {form: FamilyQuestFormType, questId: number, updatedAt: string}) => putFamilyQuest({
      family_quest: {
        is_public: form.isPublic,
      },
      quest: {
        icon: form.icon,
        name: form.name,
        id: questId,
        updated_at: updatedAt
      },
      tags: form.tags.map(t => { return { name: t }})
    }),
    onSuccess: (_data, variables) => {
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["familyQuest", variables.questId] })
      // フィードバックメッセージを表示する
      toast('クエストを更新しました', {duration: 1500})
    },
    onError: (err) => {
      handleAppError(err, router)
    }
  })

  /** 更新ハンドル */
  const handleUpdate = ({form, questId, updatedAt}: {form: FamilyQuestFormType, questId?: number, updatedAt?: string}) => {
    if (!questId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('更新します。よろしいですか？')) return
    mutation.mutate({form, questId, updatedAt})
  }

  return {
    handleUpdate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
