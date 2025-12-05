"use client"

import useSWR from "swr"
import { ProfileColumns, UserFilterSchema } from "../../api/users/entity"
import { fetchUsers } from "../../api/users/login/query"
import { SortOrder } from "@/app/(core)/schema"

/** ユーザリストを取得する */
export const useUsers = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: UserFilterSchema, sortColumn: ProfileColumns, sortOrder: SortOrder, page: number, pageSize: number}) => {

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
