"use client"

import { fetchQuestCategories } from "../../../../api/quests/category/query"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useQuery } from "@tanstack/react-query"
import { LOGIN_URL } from "@/app/(core)/constants"
import { ClientAuthError } from "@/app/(core)/error/appError"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/(core)/_supabase/client"
import { devLog } from "@/app/(core)/util"
import { createQuestCategoryById } from "../../../../api/quests/category/entity"


export const useQuestCategories = () => {
  const router = useRouter()
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["questCategories"],
    retry: false,
    queryFn: async () => {
      devLog("クエストカテゴリ取得処理")
      // セッションストレージからクエストカテゴリを取得する
      let fetchedQuestCategories = appStorage.questCategories.get() || []
      devLog("クエストカテゴリ取得: ", fetchedQuestCategories)
      // 取得できなかった場合
      if (fetchedQuestCategories.length == 0) {
        // クエストカテゴリを取得する
        fetchedQuestCategories = await fetchQuestCategories({supabase})
        if (!fetchedQuestCategories) {
          // フィードバックメッセージを表示する
          appStorage.feedbackMessage.set({ message: "クエストカテゴリのロードに失敗しました。再度ログインしてください。", type: "error" })
          // ログイン画面に遷移する
          router.push(LOGIN_URL)
          // 認証エラーを発生させる
          throw new ClientAuthError()
        }
        // セッションストレージに格納する
        appStorage.questCategories.set(fetchedQuestCategories)
      }
      // クエストカテゴリ辞書を取得する
      const questCategoryById = createQuestCategoryById(fetchedQuestCategories)

      devLog("取得クエストカテゴリ: ", fetchedQuestCategories)
      return { questCategories: fetchedQuestCategories, questCategoryById }
    }
  })

  return { 
    questCategories: data?.questCategories ?? [], 
    isLoading,
    questCategoryById: data?.questCategoryById
  }
}
