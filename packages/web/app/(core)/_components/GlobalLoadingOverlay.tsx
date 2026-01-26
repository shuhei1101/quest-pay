"use client"

import { LoadingOverlay } from "@mantine/core"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useGlobalLoadingStore } from "../_hooks/useGlobalLoadingStore"

/** グローバルローディングオーバーレイコンポーネント */
export const GlobalLoadingOverlay = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isLoading, stopLoading } = useGlobalLoadingStore()

  // パス名やクエリパラメータが変更されたらローディングを停止する
  useEffect(() => {
    stopLoading()
  }, [pathname, searchParams, stopLoading])

  return (
    <LoadingOverlay
      visible={isLoading}
      zIndex={9999}
      overlayProps={{ 
        radius: "sm", 
        blur: 2,
        color: "#000",
        backgroundOpacity: 0.35
      }}
      loaderProps={{ 
        size: "lg",
        type: "dots"
      }}
    />
  )
}
