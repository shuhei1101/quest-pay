"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { deactivatePublicQuest } from "@/app/api/quests/public/[id]/deactivate/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"

/** 無効化ボタン押下時のハンドル */
export const useDeactivatePublicQuest = () => {
  const router = useRouter()
  /** 無効化処理 */
  const mutation = useMutation({
    mutationFn: ({publicQuestId, updatedAt}: {publicQuestId: string, updatedAt: string}) => deactivatePublicQuest({
      publicQuestId,
      request: {updatedAt}
    }),
    onSuccess: (_data, variables) => {
      // 公開クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["publicQuest", variables.publicQuestId] })

      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set({ message: "クエストを無効化しました", type: "success" })
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 無効化ハンドル */
  const handleDeactivate = ({publicQuestId, updatedAt}: {publicQuestId?: string, updatedAt?: string}) => {
    if (!publicQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('無効化します。よろしいですか？')) return
    mutation.mutate({publicQuestId, updatedAt})
  }

  return {
    handleDeactivate,
    isLoading: mutation.isPending,
  }
  
}
