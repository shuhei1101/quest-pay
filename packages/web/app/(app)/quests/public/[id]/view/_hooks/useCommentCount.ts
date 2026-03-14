"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useQuery } from "@tanstack/react-query"
import { getPublicQuestCommentsCount } from "@/app/api/quests/public/[id]/comments/count/client"

/** 公開クエストのコメント数を取得する */
export const useCommentCount = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // コメント数を取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["publicQuestCommentCount", id],
    retry: false,
    queryFn: () => getPublicQuestCommentsCount({ publicQuestId: id }),
    enabled: !!id
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    commentCount: data?.count,
    isLoading,
  }
}
