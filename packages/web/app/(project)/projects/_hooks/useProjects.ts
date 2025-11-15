"use client"

import useSWR from "swr"
import { ProjectColumns, ProjectFilterSchema } from "../../_schema/projectSchema"
import { fetchProjects } from "../../_query/projectQuery"
import { SortOrder } from "@/app/(core)/appSchema"

/** プロジェクトリストを取得する */
export const useProjects = ({filter, sortColumn, sortOrder, page, pageSize}:{
  filter: ProjectFilterSchema, sortColumn: ProjectColumns, sortOrder: SortOrder, page: number, pageSize: number}) => {

  // 検索条件に紐づくプロジェクトリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["プロジェクトリスト", filter, sortColumn, sortOrder, page, pageSize],
    () => fetchProjects({
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
    fetchedProjects: data?.projects ?? [],
    totalRecords: data?.totalRecords ?? 0,
    isLoading,
    refresh :mutate
  }
}
