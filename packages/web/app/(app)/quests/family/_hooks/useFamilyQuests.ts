"use client"

import useSWR from "swr"
import { SortOrder } from "@/app/(core)/schema"
import { FamilyQuestFilterType } from "@/app/api/quests/family/schema"
import { FamilyQuestColumns } from "@/app/api/quests/family/view"
import { getFamilyQuests } from "@/app/api/quests/family/client"

/** クエストリストを取得する */
export const useFamilyQuests = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: FamilyQuestFilterType, 
  sortColumn: FamilyQuestColumns, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number
}) => {

  // 検索条件に紐づくクエストリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["クエストリスト", filter, sortColumn, sortOrder, page, pageSize],
    () => getFamilyQuests({
      tags: filter.tags,
      name: filter.name,
      sortColumn,
      sortOrder,
      page,
      pageSize
    })
  )

  // エラーをチェックする
  if (error) throw error;

  return {
    fetchedQuests: data?.quests ?? [],
    totalRecords: data?.totalRecords ?? 0,
    isLoading,
    refresh :mutate
  }
}
