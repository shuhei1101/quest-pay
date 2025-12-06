"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FamilyQuestFormType } from "../form"
import { postFamilyQuest } from "@/app/api/quests/family/client"
import toast from "react-hot-toast"
import { handleAppError } from "@/app/(core)/errorHandler"


/** 登録ボタン押下時のハンドル */
export const useRegisterFamilyQuest = ({setId}: {setId: (id: number) => void}) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  /** 登録処理 */
  const mutation = useMutation({
    mutationFn: ({form}: {form: FamilyQuestFormType}) => postFamilyQuest({
      familyQuest: {
        is_public: form.isPublic,
      },
      quest: {
        icon: form.icon,
        name: form.name
      },
      tags: form.tags.map(t => { return { name: t }})
    }),
    onSuccess: ( data ) => {
      // 取得したIDをセットする
      setId(data.questId)
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
  const handleRegister = ({form}: {form: FamilyQuestFormType}) => {
    if (!window.confirm('登録します。よろしいですか？')) return
    mutation.mutate({form})
  }

  return {
    handleRegister,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
