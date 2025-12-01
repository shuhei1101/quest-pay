"use client"

import { useEffect, useState } from "react"
import { fetchIconCategories } from "../_query/iconCategoryQuery"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { IconCategoryEntity } from "../_schema/iconCategorySchema"


export const useIconCategories = () => {
  const [iconCategories, setIconCategories] = useState<IconCategoryEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    /** アイコンカテゴリを取得する */
    const loadIconCategories = async () => {
    // セッションストレージからアイコンカテゴリを取得する
      let storedIconCategories = appStorage.iconCategories.get() || []

    // 取得できなかった場合
      if (storedIconCategories.length == 0) {
        // アイコンカテゴリを取得する
        storedIconCategories = await fetchIconCategories()
        // セッションストレージに格納する
        if (storedIconCategories) appStorage.iconCategories.set(storedIconCategories)
      }

      // 状態を更新する
      setIconCategories(storedIconCategories)
      setIsLoading(false)
    }
    loadIconCategories()

  }, [])

  return { iconCategories, isLoading }
}
