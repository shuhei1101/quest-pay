"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { LOGIN_URL } from "../../constants"
import { appStorage } from "../../_sessionStorage/appStorage"


// 画面側の例外ハンドル
export const handleAppError = (error: any, router: AppRouterInstance) => {
  // 次画面で表示するメッセージを登録
  appStorage.feedbackMessage.set(error.message)
  
  // 前画面がある場合、遷移する
  const parentScreen = appStorage.parentScreen.get()
  router.push(`${parentScreen ?? LOGIN_URL}`)
}
