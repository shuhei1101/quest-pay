"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { getFamilyQuest } from "@/app/api/quests/family/[id]/client"
import { useQuery } from "@tanstack/react-query"
import { logger } from "@/app/(core)/logger"

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

  logger.debug("家族クエスト取得", {
    isLoading,
    hasError: !!error,
    hasData: !!data,
    hasFamilyQuest: !!data?.familyQuest,
    questName: data?.familyQuest?.quest?.name,
    detailsCount: data?.familyQuest?.details?.length,
    iconName: data?.familyQuest?.icon?.name,
    fullData: data,
    fullFamilyQuest: data?.familyQuest
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    familyQuest: data?.familyQuest,
    isLoading,
  }
}
