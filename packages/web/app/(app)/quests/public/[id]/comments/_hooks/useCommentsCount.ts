"use client"

import { useQuery } from "@tanstack/react-query"
import { getPublicQuestCommentsCount } from "@/app/api/quests/public/[id]/comments/count/client"

/** 公開クエストのコメント数を取得する */
export const useCommentsCount = ({ publicQuestId }: { publicQuestId: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["publicQuestCommentsCount", publicQuestId],
    queryFn: () => getPublicQuestCommentsCount({ publicQuestId }),
  })

  return {
    count: data?.count || 0,
    isLoading,
    error,
  }
}
