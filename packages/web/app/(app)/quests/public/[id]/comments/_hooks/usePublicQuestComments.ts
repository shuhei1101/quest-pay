"use client"

import { PUBLIC_QUEST_COMMENTS_API_URL } from "@/app/(core)/endpoints"
import { GetPublicQuestCommentsResponse } from "@/app/api/quests/public/[id]/comments/route"
import useSWR from "swr"

/** 公開クエストのコメント一覧を取得する */
export const usePublicQuestComments = ({ publicQuestId }: { publicQuestId: string }) => {
  const { data, error, mutate } = useSWR<GetPublicQuestCommentsResponse>(
    PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId),
    (url: string) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error("コメントの取得に失敗しました")
        return res.json()
      })
  )

  return {
    comments: data?.comments,
    isLoading: !error && !data,
    error,
    refetch: mutate,
  }
}
