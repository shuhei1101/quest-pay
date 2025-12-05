"use client"

import useSWR from "swr"
import { ChildColumns } from "../../_schema/childEntity"
import { SortOrder } from "@/app/(core)/schema"
import { fetchChildren } from "../../api/children/_query/childQuery"

/** クエストリストを取得する */
export const useChildren = ({sortColumn, sortOrder, page, pageSize}:{
  sortColumn: ChildColumns, sortOrder: SortOrder, page: number, pageSize: number}) => {

  // 検索条件に紐づくクエストリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["クエストリスト", sortColumn, sortOrder, page, pageSize],
    () => fetchChildren({
      sortColumn,
      sortOrder,
      page,
      pageSize,
    })
  )

  // エラーをチェックする
  if (error) throw error;

  return {
    fetchedChildren: data?.children ?? [],
    totalRecords: data?.totalRecords ?? 0,
    isLoading,
    refresh :mutate
  }
}
