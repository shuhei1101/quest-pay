"use client"
import useSWR from "swr"
import { fetchParent } from "../_query/parentQuery"

/** 親の情報を取得する */
export const useParent = (userId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["parent", userId] : undefined,
    () => fetchParent(userId!)
  )

  return {
    data,
    error,
    isLoading,
    mutate
  }
}
