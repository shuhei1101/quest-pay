"use client"
import useSWR from "swr"
import { fetchChild } from "../_query/childQuery"

/** 子供の情報を取得する */
export const useChild = (userId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["child", userId] : undefined,
    () => fetchChild(userId!)
  )

  return {
    data,
    error,
    isLoading,
    mutate
  }
}
