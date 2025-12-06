"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { FAMILY_QUESTS_URL } from "@/app/(core)/constants"
import { useMutation } from "@tanstack/react-query"
import { deleteFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { ClientValueError } from "@/app/(core)/appError"

/** 削除ボタン押下時のハンドル */
export const useDeleteFamilyQuest = () => {
  const router = useRouter()

  /** 削除処理 */
  const mutation = useMutation({
    mutationFn: ({questId, updatedAt}: {questId: number, updatedAt: string}) => deleteFamilyQuest({
      quest: {
        id: questId,
        updated_at: updatedAt
      }
    }),
    onSuccess: () => {
      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set('クエストを削除しました')
      
      // クエスト一覧画面に戻る
      router.push(FAMILY_QUESTS_URL)
    }
  })

  /** 削除ハンドル */
  const handleDelete = ({questId, updatedAt}: {questId?: number, updatedAt?: string}) => {
    if (!questId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('削除します。よろしいですか？')) return
    mutation.mutate({questId, updatedAt})
  }

  return {
    handleDelete,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
