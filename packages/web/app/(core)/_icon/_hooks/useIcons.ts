"use client"

import { useEffect, useState } from "react"
import { fetchIcons } from "../_query/iconQuery"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { IconEntityWithCategoriesEntity } from "../_schema/iconSchema"


export const useIcons = () => {
  const [icons, setIcons] = useState<IconEntityWithCategoriesEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    /** アイコンを取得する */
    const loadIcons = async () => {
    // セッションストレージからアイコンを取得する
      let storedIcons = appStorage.icons.get() || []

    // 取得できなかった場合
      if (storedIcons.length == 0) {
        // アイコンを取得する
        storedIcons = await fetchIcons()
        // セッションストレージに格納する
        if (storedIcons) appStorage.icons.set(storedIcons)
      }

      // 状態を更新する
      setIcons(storedIcons)
      setIsLoading(false)
    }
    loadIcons()

  }, [])

  return { icons, isLoading }
}
