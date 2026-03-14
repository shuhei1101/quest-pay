"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ROOT_URL } from "../../endpoints"
import { appStorage } from "../../_sessionStorage/appStorage"
import { logger } from "../../logger"
import { createClient } from "../../_supabase/client"


// 画面側の例外ハンドル
export const handleAppError = async (error: Error, router: AppRouterInstance) => {
  logger.error("クライアント側エラー発生", { message: error.message, stack: error.stack })
  // 次画面で表示するメッセージを登録
  appStorage.feedbackMessage.set({ message: error.message, type: "error" })
  // 前画面がある場合、遷移する
  let redirectUrl = appStorage.parentScreen.get()
  if (!redirectUrl) {
    // サインアウトする
    await createClient().auth.signOut()
    redirectUrl = ROOT_URL
  }
  
  router.push(`${redirectUrl}`)
}
