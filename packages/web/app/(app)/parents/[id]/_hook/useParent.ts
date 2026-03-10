"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getParent } from "@/app/api/parents/[id]/client"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 親情報を取得する */
export const useParent = ({parentId}: {parentId: string}) => {
  const router = useRouter()

  // IDに紐づく親を取得する
  const { error, data, isLoading} = useQuery({
    queryKey: ["Parent", parentId],
    retry: false,
    queryFn: () => getParent(parentId!),
    enabled: !!parentId
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return {
    parent: data?.parent,
    stats: data?.stats,
    isLoading
  }
}
