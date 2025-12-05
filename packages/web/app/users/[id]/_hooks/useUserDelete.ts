"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { USERS_URL } from "@/app/(core)/constants"
import { UserFormSchema } from "@/app/api/users/entity"
import { userApi } from "@/app/api/users/_api-client/userApi"

/** 削除ボタン押下時のハンドル */
export const useUserDelete = () => {
  const router = useRouter()
  const handleDelete = async (user: UserFormSchema) => {
    try {
      // 削除確認を行う
      if (window.confirm('削除します。よろしいですか？')) {

        // クエストを削除する
        await userApi.delete(user)

        // 前画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを削除しました')
          
        // クエスト一覧画面に戻る
        router.push(`${USERS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleDelete }
}
