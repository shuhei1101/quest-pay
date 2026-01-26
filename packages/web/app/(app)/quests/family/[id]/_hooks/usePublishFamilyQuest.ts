"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useMutation } from "@tanstack/react-query"
import { ClientValueError } from "@/app/(core)/error/appError"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"
import { publishFamilyQuestPublic } from "@/app/api/quests/family/[id]/publish/client"

/** 公開ボタン押下時のハンドル */
export const usePublishFamilyQuest = () => {
  const router = useRouter()
  /** 公開処理 */
  const mutation = useMutation({
    mutationFn: ({familyQuestId}: {familyQuestId: string}) => publishFamilyQuestPublic({
      familyQuestId,
    }),
    onSuccess: () => {
      // 次画面で表示する成功メッセージを登録
      appStorage.feedbackMessage.set({ message: "クエストを公開しました", type: "success" })
      
      // クエスト一覧画面に戻る
      router.push(FAMILY_QUESTS_URL)
    },
    onError: (error) => handleAppError(error, router)
  })

  /** 公開ハンドル */
  const handlePublish = ({familyQuestId}: {familyQuestId?: string}) => {
    if (!familyQuestId) throw new ClientValueError()
    mutation.mutate({familyQuestId})
  }

  return {
    handlePublish,
    isLoading: mutation.isPending,
  }
  
}
