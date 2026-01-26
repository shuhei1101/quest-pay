"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"
import { likeQuest } from "@/app/api/quests/public/[id]/like/client"
import { queryClient } from "@/app/(core)/tanstack"
import toast from "react-hot-toast"

/** いいねボタン押下時のハンドル */
export const useLikeQuest = () => {
  const router = useRouter()
  /** いいね処理 */
  const mutation = useMutation({
    mutationFn: ({publicQuestId}: {publicQuestId: string}) => likeQuest({
      publicQuestId,
    }),
    onSuccess: (_data, variables) => {
      // 次画面で表示する成功メッセージを登録
      toast.success('クエストをいいねしました', {duration: 1500})
      // 家族クエストをリフレッシュする
      queryClient.invalidateQueries({ queryKey: ["publicQuestLikeCount", variables.publicQuestId] })
      queryClient.invalidateQueries({ queryKey: ["IsLike", variables.publicQuestId] })
    },
    onError: (error) => handleAppError(error, router)
  })

  /** いいねハンドル */
  const handleLike = ({publicQuestId}: {publicQuestId?: string}) => {
    if (!publicQuestId) throw new ClientValueError()
    mutation.mutate({publicQuestId})
  }

  return {
    handleLike,
    isLoading: mutation.isPending,
  }
  
}
