"use client"

import useSWR from "swr"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { getFamilyQuest } from "@/app/api/quests/family/[id]/client"

/** クエストを取得する */
export const useFamilyQuest = ({
  id
}:{
  id: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["クエストリスト", id],
    () => getFamilyQuest({
      familyQuestId: id
    })
  )

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    familyQuest: data?.familyQuest,
    isLoading,
    refresh :mutate
  }
}
