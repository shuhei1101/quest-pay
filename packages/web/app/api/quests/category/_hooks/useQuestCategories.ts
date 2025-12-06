"use client"

import { fetchQuestCategories } from "../query"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useQuery } from "@tanstack/react-query"
import { LOGIN_URL } from "@/app/(core)/constants"
import { ClientAuthError } from "@/app/(core)/appError"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/(core)/_supabase/client"


export const useQuestCategories = () => {
  const router = useRouter()
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["questCategories"],
    retry: false,
    queryFn: async () => {
      // セッションストレージからクエストカテゴリを取得する
      let fetchedQuestCategories = appStorage.questCategories.get() || []
      // 取得できなかった場合
      if (fetchedQuestCategories.length == 0) {
        // クエストカテゴリを取得する
        fetchedQuestCategories = await fetchQuestCategories({supabase})
        if (!fetchedQuestCategories) {
          // フィードバックメッセージを表示する
          appStorage.feedbackMessage.set("クエストカテゴリのロードに失敗しました。再度ログインしてください。")
          // ログイン画面に遷移する
          router.push(LOGIN_URL)
          // 認証エラーを発生させる
          throw new ClientAuthError()
        }
        // セッションストレージに格納する
        if (fetchedQuestCategories) appStorage.questCategories.set(fetchedQuestCategories)
      }
      return { questCategories: fetchedQuestCategories }
    }
  })

  return { 
    questCategories: data?.questCategories ?? [], 
    isLoading 
  }
}
