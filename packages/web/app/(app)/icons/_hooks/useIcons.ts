"use client"

import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useQuery } from "@tanstack/react-query"
import { LOGIN_URL } from "@/app/(core)/endpoints"
import { useRouter } from "next/navigation"
import { createIconById } from "../../../api/icons/entity"
import { devLog } from "@/app/(core)/util"
import { getIcons } from "@/app/api/icons/client"
import { handleAppError } from "@/app/(core)/error/handler/client"


export const useIcons = () => {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ["icons"],
    retry: false,
    queryFn: async () => {
      // セッションストレージからアイコンを取得する
      let fetchedIcons = appStorage.icons.get() || []
      // 取得できなかった場合
      if (fetchedIcons.length == 0) {
        // アイコンを取得する
        const data = await getIcons()
        fetchedIcons = data.icons
        if (!fetchedIcons) {
          // フィードバックメッセージを表示する
          appStorage.feedbackMessage.set({ message: "アイコンのロードに失敗しました。再度ログインしてください。", type: "error" })
          // ログイン画面に遷移する
          router.push(LOGIN_URL)
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

  // エラーをチェックする
  if (error) handleAppError(error, router)

  return { 
    icons: data?.icons ?? [], 
    isLoading,
    iconById: data?.iconById
  }
}
