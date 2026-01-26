"use client"

import { useRouter as useNextRouter } from "next/navigation"
import { useGlobalLoadingStore } from "./useGlobalLoadingStore"
import { useCallback } from "react"

/** ページ遷移時にローディングを表示するカスタムルーター */
export const useRouter = () => {
  const router = useNextRouter()
  const { startLoading } = useGlobalLoadingStore()

  /** ローディングを開始してからページ遷移する */
  const push = useCallback((href: string, options?: any) => {
    startLoading()
    router.push(href, options)
  }, [router, startLoading])

  /** ローディングを開始してからページ遷移する */
  const replace = useCallback((href: string, options?: any) => {
    startLoading()
    router.replace(href, options)
  }, [router, startLoading])

  return {
    ...router,
    push,
    replace,
  }
}
