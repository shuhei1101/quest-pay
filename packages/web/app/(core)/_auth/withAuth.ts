import { createClient } from "../_supabase/server"
import { LOGIN_URL } from "../endpoints"
import { AuthorizedError } from "../error/appError"
import { addQueryParam, devLog } from "../util"
import { db } from "@/index"
import { redirect } from "next/navigation"

/** 認証済みならsupabaseとuserIdを返す */
export async function getAuthContext() {
  try {
  const supabase = await createClient()

  const { data: { user }, error } =
    await supabase.auth.getUser()

  if (error) {
    devLog("getAuthContext.user取得失敗:", error)
    throw error
  }

  if (!user?.id) {
    throw new AuthorizedError("ログインが必要です")
  }

  return {
    db: db,
    userId: user.id,
  }
} catch (e) {
    // エラーメッセージをクエリパラメータに付与する
    const urlWithError = addQueryParam(LOGIN_URL, 'error', 'このページにアクセスする権限がありません')
    
    // 指定されたURLまたはクエスト画面に遷移する
    redirect(urlWithError)
  }
}
