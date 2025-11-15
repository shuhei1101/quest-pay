"use client"

import useSWR from "swr"
import { UserColumns, UserFilterSchema } from "../../_schema/userSchema"
import { fetchUsers } from "../../_query/userQuery"
import { SortOrder } from "@/app/(core)/appSchema"

/** ユーザリストを取得する */
export const useUsers = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: UserFilterSchema, sortColumn: UserColumns, sortOrder: SortOrder, page: number, pageSize: number}) => {

  // 検索条件に紐づくユーザリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["ユーザリスト", filter, sortColumn, sortOrder, page, pageSize],
    () => fetchUsers({
      filter,
      sortColumn,
      sortOrder,
      page,
      pageSize,
    })
  )

  // エラーをチェックする
  if (error) throw error;

  return {
    fetchedUsers: data?.users ?? [],
    totalRecords: data?.totalRecords ?? 0,
    isLoading,
    refresh :mutate
  }
}
