"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { deletePublicQuest } from "@/app/api/quests/public/[id]/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FAMILY_QUESTS_URL, QUESTS_URL } from "@/app/(core)/endpoints"
import { queryClient } from "@/app/(core)/tanstack"

/** 削除ボタン押下時のハンドル */
export const useDeletePublicQuest = () => {
  const router = useRouter()
  /** 削除処理 */
  const mutation = useMutation({
    mutationFn: ({publicQuestId, updatedAt}: {publicQuestId: string, updatedAt: string}) => deletePublicQuest({
      publicQuestId,
      request: {updatedAt}
    }),
    onSuccess: (_data, variables) => {
      // 公開クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["publicQuest", variables.publicQuestId] })

      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set({ message: "クエストを削除しました", type: "success" })
      
      // クエスト一覧画面に戻る
      router.push(QUESTS_URL)
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 削除ハンドル */
  const handleDelete = ({publicQuestId, updatedAt}: {publicQuestId?: string, updatedAt?: string}) => {
    if (!publicQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('削除します。よろしいですか？')) return
    mutation.mutate({publicQuestId, updatedAt})
  }

  return {
    handleDelete,
    isLoading: mutation.isPending,
  }
  
}
