"use client"

import { SortOrder } from "@/app/(core)/schema"
import { getChildQuests } from "@/app/api/children/[id]/quests/client"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import type { QuestColumn } from "@/drizzle/schema"
import { ChildQuestFilterType } from "@/app/api/quests/family/[id]/child/query"
import { useQuery } from "@tanstack/react-query"

/** クエストリストを取得する */
export const useChildQuests = ({filter, sortColumn, sortOrder, page, pageSize, childId}:{
  filter: ChildQuestFilterType, 
  sortColumn: QuestColumn, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number,
  childId?: string
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["childQuests", filter, sortColumn, sortOrder, page, pageSize, childId],
    retry: false,
    queryFn: () => getChildQuests({
      childId: childId!,
      params: {
        tags: filter.tags,
        name: filter.name,
        categoryId: filter.categoryId,
        sortColumn,
        sortOrder,
        page,
        pageSize,
      },
    }),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!childId,
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
