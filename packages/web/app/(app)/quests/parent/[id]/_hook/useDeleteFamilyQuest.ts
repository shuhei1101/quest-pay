"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { deleteFamilyQuest } from "@/app/api/quests/family/[id]/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"

/** 削除ボタン押下時のハンドル */
export const useDeleteFamilyQuest = () => {
  const router = useRouter()
  /** 削除処理 */
  const mutation = useMutation({
    mutationFn: ({familyQuestId, updatedAt}: {familyQuestId: string, updatedAt: string}) => deleteFamilyQuest({
      familyQuestId,
      request: {updatedAt}
    }),
    onSuccess: () => {
      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set({ message: "クエストを削除しました", type: "success" })
      
      // クエスト一覧画面に戻る
      router.push(FAMILY_QUESTS_URL)
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 削除ハンドル */
  const handleDelete = ({familyQuestId, updatedAt}: {familyQuestId?: string, updatedAt?: string}) => {
    if (!familyQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('削除します。よろしいですか？')) return
    mutation.mutate({familyQuestId, updatedAt})
  }

  return {
    handleDelete,
    isLoading: mutation.isPending,
  }
  
}
