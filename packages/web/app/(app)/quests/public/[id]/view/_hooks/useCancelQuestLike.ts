"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"
import { cancelLikeQuest } from "@/app/api/quests/public/[id]/like/cancel/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"

/** いいね解除ボタン押下時のハンドル */
export const useCancelQuestLike = () => {
  const router = useRouter()
  /** いいね解除処理 */
  const mutation = useMutation({
    mutationFn: ({publicQuestId}: {publicQuestId: string}) => cancelLikeQuest({
      publicQuestId,
    }),
    onSuccess: (_data, variables) => {
      // 次画面で表示する成功メッセージを登録
      toast.success('クエストのいいねを解除しました', {duration: 1500})
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["publicQuestLikeCount", variables.publicQuestId] })
      queryClient.invalidateQueries({ queryKey: ["IsLike", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router)
  })

  /** いいね解除ハンドル */
  const handleCancelLike = ({publicQuestId}: {publicQuestId?: string}) => {
    if (!publicQuestId) throw new ClientValueError()
    mutation.mutate({publicQuestId})
  }

  return {
    handleCancelLike,
    isLoading: mutation.isPending,
  }
  
}
