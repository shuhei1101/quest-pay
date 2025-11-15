"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { USERS_URL } from "@/app/(core)/appConstants"
import { UserFormSchema } from "@/app/(user)/_schema/userSchema"
import { userApi } from "@/app/(user)/_api-client/userApi"

/** 削除ボタン押下時のハンドル */
export const useUserDelete = () => {
  const router = useRouter()
  const handleDelete = async (user: UserFormSchema) => {
    try {
      // 削除確認を行う
      if (window.confirm('削除します。よろしいですか？')) {

        // タスクを削除する
        await userApi.delete(user)

        // 前画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('タスクを削除しました')
          
        // タスク一覧画面に戻る
        router.push(`${USERS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleDelete }
}
