"use client"

import { fetchIconCategories } from "../../../../api/icons/category/query"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { LOGIN_URL } from "@/app/(core)/constants"
import { ClientAuthError } from "@/app/(core)/appError"
import { createClient } from "@/app/(core)/_supabase/client"
import { devLog } from "@/app/(core)/util"


export const useIconCategories = () => {
  const router = useRouter()
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["iconCategories"],
    retry: false,
    queryFn: async () => {
    // セッションストレージからアイコンを取得する
      let fetchedIconCategories = appStorage.iconCategories.get() || []
      // 取得できなかった場合
      if (fetchedIconCategories.length == 0) {
        // アイコンを取得する
        fetchedIconCategories = await fetchIconCategories({supabase})
        if (!fetchedIconCategories) {
          // フィードバックメッセージを表示する
          appStorage.feedbackMessage.set("アイコンカテゴリのロードに失敗しました。再度ログインしてください。")
          // ログイン画面に遷移する
          router.push(LOGIN_URL)
          // 認証エラーを発生させる
          throw new ClientAuthError()
        }
        // セッションストレージに格納する
        if (fetchedIconCategories) appStorage.iconCategories.set(fetchedIconCategories)
      }
      devLog("取得カテゴリ: ", fetchedIconCategories)
      return { iconCategories: fetchedIconCategories }
    }
  })

  return { 
    iconCategories: data?.iconCategories ?? [], 
    isLoading
  }
}
