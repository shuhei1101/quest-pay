"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useQuery } from "@tanstack/react-query"
import { getTemplateQuestByPublicQuestId } from "@/app/api/quests/template/public/[id]/client"

/** いいねされているかどうかを取得する */
export const useIsLike = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["IsLike", id],
    retry: false,
    queryFn: () => getTemplateQuestByPublicQuestId({ publicQuestId: id }),
    enabled: !!id,
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    isLike: !!data?.templateQuest,
    isLoading,
  }
}
