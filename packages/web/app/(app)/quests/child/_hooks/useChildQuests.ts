"use client"

import { SortOrder } from "@/app/(core)/schema"
import { getChildQuests } from "@/app/api/quests/child/client"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import type { QuestColumn } from "@/drizzle/schema"
import { ChildQuestFilterType } from "@/app/api/quests/child/query"
import { useQuery } from "@tanstack/react-query"

/** クエストリストを取得する */
export const useChildQuests = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: ChildQuestFilterType, 
  sortColumn: QuestColumn, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["childQuests", filter, sortColumn, sortOrder, page, pageSize],
    retry: false,
    queryFn: () => getChildQuests({
      tags: filter.tags,
      name: filter.name,
      sortColumn,
      sortOrder,
      page,
      pageSize
    }),
    staleTime: 0,
    refetchOnMount: "always",
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    fetchedQuests: data?.rows ?? [],
    totalRecords: data?.totalRecords ?? 0,
    maxPage: Math.ceil((data?.totalRecords ?? 0) / pageSize),
    isLoading,
  }
}
