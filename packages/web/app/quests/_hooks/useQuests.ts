"use client"

import useSWR from "swr"
import { QuestColumns } from "../../api/quests/entity"
import { SortOrder } from "@/app/(core)/schema"
import { QuestFilterType } from "../../api/quests/schema"
import { questsGet } from "../../api/quests/client"

/** クエストリストを取得する */
export const useQuests = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: QuestFilterType, sortColumn: QuestColumns, sortOrder: SortOrder, page: number, pageSize: number}) => {

  // 検索条件に紐づくクエストリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["クエストリスト", filter, sortColumn, sortOrder, page, pageSize],
    () => questsGet({
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
