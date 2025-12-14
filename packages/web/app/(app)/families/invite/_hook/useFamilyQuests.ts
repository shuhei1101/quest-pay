"use client"

import { SortOrder } from "@/app/(core)/schema"
import { FamilyQuestFilterType } from "@/app/api/quests/family/schema"
import { FamilyQuestColumns } from "@/app/api/quests/family/view"
import { getFamilyQuests } from "@/app/api/quests/family/client"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

/** クエストリストを取得する */
export const useFamilyQuests = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: FamilyQuestFilterType, 
  sortColumn: FamilyQuestColumns, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number
}) => {
  const router = useRouter()

  // 検索条件に紐づくクエストリストを取得する
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["familyQuests", filter, sortColumn, sortOrder, page, pageSize],
    retry: false,
    queryFn: () => getFamilyQuests({
      tags: filter.tags,
      name: filter.name,
      sortColumn,
      sortOrder,
      page,
      pageSize
    })
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    fetchedQuests: data?.quests ?? [],
    totalRecords: data?.totalRecords ?? 0,
    maxPage: Math.ceil((data?.totalRecords ?? 0) / pageSize),
    isLoading,
    refetch
  }
}
