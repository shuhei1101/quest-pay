"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { activatePublicQuest } from "@/app/api/quests/public/[id]/activate/client"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"

/** 有効化ボタン押下時のハンドル */
export const useActivatePublicQuest = () => {
  const router = useRouter()
  /** 有効化処理 */
  const mutation = useMutation({
    mutationFn: ({publicQuestId, updatedAt}: {publicQuestId: string, updatedAt: string}) => activatePublicQuest({
      publicQuestId,
      request: {updatedAt}
    }),
    onSuccess: (_data, variables) => {
      // 公開クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["publicQuest", variables.publicQuestId] })

      // 次画面で表示する成功メッセージを登録
      toast.success("クエストを有効化しました")
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 有効化ハンドル */
  const handleActivate = ({publicQuestId, updatedAt}: {publicQuestId?: string, updatedAt?: string}) => {
    if (!publicQuestId || !updatedAt) throw new ClientValueError()
    if (!window.confirm('有効化します。よろしいですか？')) return
    mutation.mutate({publicQuestId, updatedAt})
  }

  return {
    handleActivate,
    isLoading: mutation.isPending,
  }
  
}
