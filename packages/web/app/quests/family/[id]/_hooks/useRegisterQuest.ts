"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FamilyQuestFormType } from "../form"
import { questsFamilyPost } from "@/app/api/quests/family/client"
import toast from "react-hot-toast"
import { handleAppError } from "@/app/(core)/errorHandler"


/** 登録ボタン押下時のハンドル */
export const useRegisterQuest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 登録処理 */
  const mutation = useMutation({
    mutationFn: (form: FamilyQuestFormType) => questsFamilyPost({
      familyQuest: {
        is_public: form.isPublic,
      },
      quest: {
        icon: form.icon,
        name: form.name
      },
      tags: form.tags.map(t => { return { name: t }})
    }),
    onSuccess: () => {
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["familyQuest"] })
      // フィードバックメッセージを表示する
      toast('クエストを登録しました', {duration: 1500})
    },
    onError: (err) => {
      handleAppError(err, router)
    }
  })

  /** 登録ハンドル */
  const handleRegister = (taskId: FamilyQuestFormType) => {
    if (!window.confirm('登録します。よろしいですか？')) return
    mutation.mutate(taskId)
  }

  return {
    handleRegister,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
