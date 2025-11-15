"use client"

import useSWR from "swr"
import { fetchUserTypes } from "../_query/userQuery"

/** ユーザタイプを取得する */
export const useUserTypes = () => {

  // IDに紐づくタイプを取得する
  const { data: statuses, error, mutate, isLoading } = useSWR(
    "タイプ",
    () => fetchUserTypes()
  )

  // エラーをチェックする
  if (error) throw error

  return {
    fetchedTypes: statuses ? statuses : [],
    isLoading,
    refresh :mutate
  }
}
