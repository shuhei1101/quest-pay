"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { getPublicQuest } from "@/app/api/quests/public/[id]/client"
import { useQuery } from "@tanstack/react-query"

/** クエストを取得する */
export const usePublicQuest = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["publicQuest", id],
    retry: false,
    queryFn: () => getPublicQuest({ publicQuestId: id }),
    enabled: !!id
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    publicQuest: data?.publicQuest,
    isLoading,
  }
}
