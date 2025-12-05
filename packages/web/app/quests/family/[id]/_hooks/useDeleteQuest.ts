"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { FAMILY_QUESTS_URL } from "@/app/(core)/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getFamilyQuest } from "@/app/api/quests/[id]/family/client"

/** 削除ボタン押下時のハンドル */
export const useDeleteQuest = () => {
  const router = useRouter()
  // const queryClient = useQueryClient()

  /** 削除処理 */
  const mutation = useMutation({
    mutationFn: (id: number) => getFamilyQuest(id),
    onSuccess: () => {
      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set('クエストを削除しました')
      
      // クエスト一覧画面に戻る
      router.push(FAMILY_QUESTS_URL)
    }
  })

  /** 削除ハンドル */
  const handleDelete = (taskId: number) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    mutation.mutate(taskId)
  }

  return {
    handleDelete,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
