"use client"

import { getChildren } from "@/app/api/children/client"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useQuery } from "@tanstack/react-query"

/** 子供リストを取得する */
export const useChildren = () => {
  const router = useRouter()
  // 家族の子供を取得する
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["children"],
    retry: false,
    queryFn: () => getChildren()
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    children: data?.children ?? [],
    isLoading,
    refetch
  }
}
