"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ROOT_URL } from "../../constants"
import { appStorage } from "../../_sessionStorage/appStorage"
import { devLog } from "../../util"


// 画面側の例外ハンドル
export const handleAppError = (error: Error, router: AppRouterInstance) => {
  devLog("handleAppError.エラー内容: ", error)
  // 次画面で表示するメッセージを登録
  appStorage.feedbackMessage.set({ message: error.message, type: "error" })
  
  // 前画面がある場合、遷移する
  const parentScreen = appStorage.parentScreen.get()
  router.push(`${parentScreen ?? ROOT_URL}`)
}
