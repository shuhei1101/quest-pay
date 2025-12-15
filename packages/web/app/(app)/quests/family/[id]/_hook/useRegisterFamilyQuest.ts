"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FamilyQuestFormType } from "../form"
import { postFamilyQuest } from "@/app/api/quests/family/client"
import toast from "react-hot-toast"


/** 家族クエスト保存ハンドル */
export const useRegisterFamilyQuest = ({setId}: {setId: (id: string) => void}) => {
  const queryClient = useQueryClient()

  /** 登録処理 */
  const mutation = useMutation({
    mutationFn: ({form}: {form: FamilyQuestFormType}) => postFamilyQuest({form}),
    onSuccess: ( data ) => {
      // 取得したIDをセットする
      setId(data.questId)
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["familyQuest"] })
      // フィードバックメッセージを表示する
      toast('クエストを登録しました', {duration: 1500})
    },
    onError: (error) => { throw error }
  })

  /** 登録ハンドル */
  const handleRegister = ({form}: {form: FamilyQuestFormType}) => {
    if (!window.confirm('登録します。よろしいですか？')) return
    mutation.mutate({form})
  }

  return {
    handleRegister,
    isLoading: mutation.isPending,
  }
  
}
