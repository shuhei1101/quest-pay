import { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "../_supabase/server"
import { AuthorizedError } from "../error/appError"
import { devLog } from "../util"

/** 認証済みならsupabaseとuserIdを返す */
export async function getAuthContext(): Promise<{
  supabase: SupabaseClient
  userId: string
}> {
  const supabase = await createClient()

  const { data: { session }, error } =
    await supabase.auth.getSession()

  if (error) {
    devLog("getAuthContext.session取得失敗:", error)
    throw error
  }

  if (!session?.user?.id) {
    throw new AuthorizedError("ログインが必要です")
  }

  return {
    supabase,
    userId: session.user.id,
  }
}
