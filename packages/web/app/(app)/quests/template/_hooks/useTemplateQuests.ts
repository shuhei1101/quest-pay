"use client"

import { SortOrder } from "@/app/(core)/schema"
import { getTemplateQuests } from "@/app/api/quests/template/client"
import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { handleAppError } from "@/app/(core)/error/handler/client"
import type { QuestColumn } from "@/drizzle/schema"
import { TemplateQuestFilterType } from "@/app/api/quests/template/query"
import { useQuery } from "@tanstack/react-query"

/** クエストリストを取得する */
export const useTemplateQuests = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: TemplateQuestFilterType, 
  sortColumn: QuestColumn, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number
}) => {
  const router = useRouter()
  
  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["templateQuests", filter, sortColumn, sortOrder, page, pageSize],
    retry: false,
    queryFn: () => getTemplateQuests({
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
