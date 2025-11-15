"use client"

import { useRouter } from "next/navigation"
import { userApi } from "../../../_api-client/userApi"
import { UserFormSchema } from "../../../_schema/userSchema"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { USERS_URL } from "@/app/(core)/appConstants"

/** 更新ボタン押下時のハンドル */
export const useUserUpdate = () => {
  const router = useRouter()
  const handleUpdate = async (user: UserFormSchema) => {
    try {
      // 更新確認を行う
      if (window.confirm('更新します。よろしいですか？')) {
          
        // ユーザを更新する
        await userApi.update(user)
        
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('ユーザを更新しました')

        // ユーザ一覧画面に戻る
        router.push(`${USERS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleUpdate }
}
