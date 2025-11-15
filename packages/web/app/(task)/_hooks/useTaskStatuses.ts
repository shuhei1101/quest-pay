"use client"

import useSWR from "swr"
import { fetchTaskStatuses } from "../_query/taskQuery"

/** タスクステータスを取得する */
export const useTaskStatuses = () => {

  // IDに紐づくステータスを取得する
  const { data: statuses, error, mutate, isLoading } = useSWR(
    "ステータス",
    () => fetchTaskStatuses()
  )

  // エラーをチェックする
  if (error) throw error

  return {
    fetchedStatuses: statuses ? statuses : [],
    isLoading,
    refresh :mutate
  }
}
