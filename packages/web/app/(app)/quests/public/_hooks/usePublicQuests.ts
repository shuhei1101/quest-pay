"use client"

import { SortOrder } from "@/app/(core)/schema"
import { getPublicQuests } from "@/app/api/quests/public/client"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import type { QuestColumn } from "@/drizzle/schema"
import { PublicQuestFilterType } from "@/app/api/quests/public/query"
import { useQuery } from "@tanstack/react-query"

/** クエストリストを取得する */
export const usePublicQuests = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: PublicQuestFilterType, 
  sortColumn: QuestColumn, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["publicQuests", filter, sortColumn, sortOrder, page, pageSize],
    retry: false,
    queryFn: () => getPublicQuests({
      tags: filter.tags,
      name: filter.name,
      categoryId: filter.categoryId,
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
