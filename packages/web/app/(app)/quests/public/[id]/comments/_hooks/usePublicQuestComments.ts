"use client"

import { useQuery } from "@tanstack/react-query"
import { getPublicQuestComments } from "@/app/api/quests/public/[id]/comments/client"

/** 公開クエストのコメント一覧を取得する */
export const usePublicQuestComments = ({ publicQuestId }: { publicQuestId: string }) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["publicQuestComments", publicQuestId],
    queryFn: () => getPublicQuestComments({ publicQuestId }),
  })

  return {
    comments: data?.comments,
    isLoading,
    error,
    refetch,
  }
}
