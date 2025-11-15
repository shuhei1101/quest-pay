"use client"

import useSWR from "swr"
import { TaskColumns, TaskFilterSchema } from "../../_schema/taskSchema"
import { fetchTasks } from "../../_query/taskQuery"
import { SortOrder } from "@/app/(core)/appSchema"

/** タスクリストを取得する */
export const useTasks = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: TaskFilterSchema, sortColumn: TaskColumns, sortOrder: SortOrder, page: number, pageSize: number}) => {

  // 検索条件に紐づくタスクリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["タスクリスト", filter, sortColumn, sortOrder, page, pageSize],
    () => fetchTasks({
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
    fetchedTasks: data?.tasks ?? [],
    totalRecords: data?.totalRecords ?? 0,
    isLoading,
    refresh :mutate
  }
}
