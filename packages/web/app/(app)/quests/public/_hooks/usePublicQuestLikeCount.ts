"use client"

import { getPublicQuestLikeCount } from "@/app/api/quests/public/[id]/like/count/client"
import { useQuery } from "@tanstack/react-query"

/** 公開クエストのいいね数を取得する */
export const usePublicQuestLikeCount = ({publicQuestId}: {publicQuestId: string}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["publicQuestLikeCount", publicQuestId],
    queryFn: () => getPublicQuestLikeCount({publicQuestId}),
    enabled: !!publicQuestId
  })

  return {
    likeCount: data?.count ?? 0,
    isLoading,
    error
  }
}
