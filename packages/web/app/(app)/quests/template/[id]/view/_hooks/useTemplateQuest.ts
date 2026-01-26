"use client"

import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { getTemplateQuest } from "@/app/api/quests/template/[id]/client"
import { useQuery } from "@tanstack/react-query"

/** クエストを取得する */
export const useTemplateQuest = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["templateQuest", id],
    retry: false,
    queryFn: () => getTemplateQuest({ templateQuestId: id }),
    enabled: !!id
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    templateQuest: data?.templateQuest,
    isLoading,
  }
}
