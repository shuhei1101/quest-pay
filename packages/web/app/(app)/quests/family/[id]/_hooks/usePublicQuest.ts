"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useQuery } from "@tanstack/react-query"
import { getPublicQuestByFamilyQuestId } from "@/app/api/quests/family/[id]/public/client"

/** 家族クエストIDに紐づく公開クエストの存在フラグを取得する */
export const usePublicQuest = ({familyQuestId}:{
  familyQuestId: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["publicQuestByFamilyQuestId", familyQuestId],
    retry: false,
    queryFn: () => getPublicQuestByFamilyQuestId({ familyQuestId }),
    staleTime: 0,
    refetchOnMount: "always",
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    publicQuest: data?.publicQuest,
    isLoading,
  }
}
