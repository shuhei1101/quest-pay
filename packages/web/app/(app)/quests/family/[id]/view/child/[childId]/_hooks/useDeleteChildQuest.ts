"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"
import { deleteChildQuest } from "@/app/api/quests/family/[id]/child/[childId]/client"
import toast from "react-hot-toast"
import { FAMILY_QUEST_VIEW_URL } from "@/app/(core)/endpoints"

/** 子供クエスト削除（進捗リセット）ボタン押下時のハンドル */
export const useDeleteChildQuest = () => {
  const router = useRouter()
  
  /** 子供クエスト削除処理 */
  const mutation = useMutation({
    mutationFn: ({familyQuestId, childId}: {familyQuestId: string, childId: string}) => deleteChildQuest({
      familyQuestId,
      childId
    }),
    onSuccess: (_data, variables) => {
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["familyQuest", variables.familyQuestId] })
      queryClient.invalidateQueries({ queryKey: ["childQuest", variables.familyQuestId] })

      // 画面で表示する成功メッセージを登録
      toast.success("進捗状況をリセットしました")
      
      // 家族クエスト閲覧画面に遷移
      router.push(FAMILY_QUEST_VIEW_URL(variables.familyQuestId))
    },
    onError: (error) => {
      handleAppError(error, router)
    }
  })

  /** 子供クエスト削除ハンドル */
  const handleDelete = ({familyQuestId, childId}: {familyQuestId?: string, childId?: string}) => {
    if (!familyQuestId || !childId) throw new ClientValueError()
    if (!window.confirm('進捗状況をリセットしますか？\nリセットすると、クエストの進行状況が削除されます。')) return
    mutation.mutate({familyQuestId, childId})
  }

  return {
    handleDelete,
    isLoading: mutation.isPending,
  }
  
}
