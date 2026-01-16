import { createClient } from "../_supabase/server"
import { AuthorizedError } from "../error/appError"
import { devLog } from "../util"
import { db } from "@/index"

/** 認証済みならsupabaseとuserIdを返す */
export async function getAuthContext() {
  const supabase = await createClient()

  const { data: { user }, error } =
    await supabase.auth.getUser()

  if (error) {
    devLog("getAuthContext.user取得失敗:", error)
    // Supabaseのセッションエラーを適切にハンドルする
    throw new AuthorizedError("ログインが必要です")
  }

  if (!user?.id) {
    throw new AuthorizedError("ログインが必要です")
  }

  return {
    db: db,
    userId: user.id,
  }
}
