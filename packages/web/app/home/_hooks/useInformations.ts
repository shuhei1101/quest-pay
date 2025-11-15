"use client"

import useSWR from "swr"
import { fetchInformations } from "../_query/informationQuery"

/** お知らせリストを取得する */
export const useInformations = () => {

  // 検索条件に紐づくお知らせリストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    ["お知らせリスト"],
    () => fetchInformations()
  )

  // エラーをチェックする
  if (error) throw error;

  return {
    fetchedInformations: data?.informations ?? [],
    isLoading,
    refresh :mutate
  }
}
