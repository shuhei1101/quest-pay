"use client"
import useSWR from "swr"
import { fetchFamily } from "../_query/familyQuery"

/** 家族の情報を取得する */
export const useFamily = (id?: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ["family", id] : undefined,
    () => fetchFamily(id!)
  )

  return {
    data,
    error,
    isLoading,
    mutate
  }
}
