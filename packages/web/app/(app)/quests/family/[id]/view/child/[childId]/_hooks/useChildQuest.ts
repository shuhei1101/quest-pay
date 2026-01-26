"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { getChildQuest } from "@/app/api/quests/family/[id]/child/[childId]/client"
import { useQuery } from "@tanstack/react-query"
import { devLog } from "@/app/(core)/util"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { HOME_URL } from "@/app/(core)/endpoints"

/** クエストを取得する */
export const useChildQuest = ({
  id, childId
}:{
  id: string
  childId: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["childQuest", id],
    retry: false,
    queryFn: async () => {
      // データを取得する
      const childQuest = await getChildQuest({ familyQuestId: id, childId })
      devLog("useChildQuest.取得データ: ", childQuest)
      // データが取得できなかった場合、ホームにリダイレクトする
      if (!childQuest.childQuest) {
        appStorage.feedbackMessage.set({ message: "子供クエストの取得に失敗しました。", type: "error" })
        router.push(HOME_URL)
        return
      }
      return childQuest
    },
    enabled: !!id && !!childId,
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    childQuest: data?.childQuest,
    isLoading,
  }
}
