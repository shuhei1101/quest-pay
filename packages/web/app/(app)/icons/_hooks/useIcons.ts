"use client"

import { fetchIcons } from "../query"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useQuery } from "@tanstack/react-query"
import { LOGIN_URL } from "@/app/(core)/constants"
import { ClientAuthError } from "@/app/(core)/appError"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/(core)/_supabase/client"
import { createIconById, IconById } from "../entity"
import { devLog } from "@/app/(core)/util"


export const useIcons = () => {
  const router = useRouter()
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["icons"],
    retry: false,
    queryFn: async () => {
      // セッションストレージからアイコンを取得する
      let fetchedIcons = appStorage.icons.get() || []
      // 取得できなかった場合
      if (fetchedIcons.length == 0) {
        // アイコンを取得する
        fetchedIcons = await fetchIcons({supabase})
        if (!fetchedIcons) {
          // フィードバックメッセージを表示する
          appStorage.feedbackMessage.set("アイコンのロードに失敗しました。再度ログインしてください。")
          // ログイン画面に遷移する
          router.push(LOGIN_URL)
          // 認証エラーを発生させる
          throw new ClientAuthError()
        }
        // セッションストレージに格納する
        appStorage.icons.set(fetchedIcons)
      }
      // アイコン辞書を取得する
      const iconById = createIconById(fetchedIcons)

      devLog("取得アイコン: ", fetchedIcons)
      return { icons: fetchedIcons, iconById }
    }
  })



  return { 
    icons: data?.icons ?? [], 
    isLoading,
    iconById: data?.iconById
  }
}
