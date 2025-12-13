"use client"

import useSWR from "swr"
import { SortOrder } from "@/app/(core)/schema"
import { FamilyQuestFilterType } from "@/app/api/quests/family/schema"
import { FamilyQuestColumns } from "@/app/api/quests/family/view"
import { getChildren } from "@/app/api/children/client"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 子供リストを取得する */
export const useChildren = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: FamilyQuestFilterType, 
  sortColumn: FamilyQuestColumns, 
  sortOrder: SortOrder, 
  page: number, 
  pageSize: number
}) => {
  const router = useRouter()
    try {
    // 検索条件に紐づく子供リストを取得する
    const { data, error, mutate, isLoading } = useSWR(
      ["子供リスト", filter, sortColumn, sortOrder, page, pageSize],
      () => getChildren()
    )

    // エラーをチェックする
    if (error) handleAppError(error, router)

    return {
      fetchedQuests: data?.quests ?? [],
      totalRecords: data?.totalRecords ?? 0,
      maxPage: Math.ceil((data?.totalRecords ?? 0) / pageSize),
      isLoading,
      refresh :mutate
    }
  } catch (error) {
    handleAppError(error, router)
  }
}
