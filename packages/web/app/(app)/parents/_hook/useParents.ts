"use client"

import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getParents } from "@/app/api/parents/client"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 親リストを取得する */
export const useParents = () => {
  const router = useRouter()
  // 家族の親を取得する
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["parents"],
    retry: false,
    queryFn: () => getParents()
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    parents: data?.parents ?? [],
    isLoading,
    refetch
  }
}
