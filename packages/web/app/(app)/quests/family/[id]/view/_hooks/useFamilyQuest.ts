"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { getFamilyQuest } from "@/app/api/quests/family/[id]/client"
import { useQuery } from "@tanstack/react-query"

/** クエストを取得する */
export const useFamilyQuest = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["familyQuest", id],
    retry: false,
    queryFn: () => getFamilyQuest({ familyQuestId: id }),
    enabled: !!id
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    familyQuest: data?.familyQuest,
    isLoading,
  }
}
