"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getChild } from "@/app/api/children/[id]/client"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 子供登録フォームを取得する */
export const useChild = ({childId}: {childId: string}) => {
  const router = useRouter()

  // IDに紐づく子供を取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["Child", childId],
    retry: false,
    queryFn: () => getChild(childId!),
    enabled: !!childId
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    child: data?.child,
    isLoading
  }
}
