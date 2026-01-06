"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useQuery } from "@tanstack/react-query"
import { getPublicQuestLikeCount } from "@/app/api/quests/public/[id]/like/count/client"

/** 公開クエストのいいね数を取得する */
export const useLikeCount = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["publicQuestLikeCount", id],
    retry: false,
    queryFn: () => getPublicQuestLikeCount({ publicQuestId: id }),
    enabled: !!id
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    likeCount: data?.count,
    isLoading,
  }
}
