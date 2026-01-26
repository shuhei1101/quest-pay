"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { deleteTemplateQuest } from "@/app/api/quests/template/[id]/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FAMILY_QUESTS_URL, QUESTS_URL } from "@/app/(core)/endpoints"
import { queryClient } from "@/app/(core)/tanstack"

/** 削除ボタン押下時のハンドル */
export const useDeleteTemplateQuest = () => {
  const router = useRouter()
  /** 削除処理 */
  const mutation = useMutation({
    mutationFn: ({templateQuestId, updatedAt}: {templateQuestId: string, updatedAt: string}) => deleteTemplateQuest({
      templateQuestId,
      request: {updatedAt}
    }),
    onSuccess: (_data, variables) => {
      // テンプレートクエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["templateQuest", variables.templateQuestId] })

      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set({ message: "クエストを削除しました", type: "success" })
      
      // クエスト一覧画面に戻る
      router.push(QUESTS_URL)
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 削除ハンドル */
  const handleDelete = ({templateQuestId, updatedAt}: {templateQuestId?: string, updatedAt?: string}) => {
    if (!templateQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('削除します。よろしいですか？')) return
    mutation.mutate({templateQuestId, updatedAt})
  }

  return {
    handleDelete,
    isLoading: mutation.isPending,
  }
  
}
