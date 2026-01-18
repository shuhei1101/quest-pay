"use client"

import { PUBLIC_QUEST_COMMENTS_COUNT_API_URL } from "@/app/(core)/endpoints"
import { GetPublicQuestCommentsCountResponse } from "@/app/api/quests/public/[id]/comments/count/route"
import useSWR from "swr"

/** 公開クエストのコメント数を取得する */
export const useCommentsCount = ({ publicQuestId }: { publicQuestId: string }) => {
  const { data, error } = useSWR<GetPublicQuestCommentsCountResponse>(
    PUBLIC_QUEST_COMMENTS_COUNT_API_URL(publicQuestId),
    (url: string) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error("コメント数の取得に失敗しました")
        return res.json()
      })
  )

  return {
    count: data?.count || 0,
    isLoading: !error && !data,
    error,
  }
}
