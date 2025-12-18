import { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "../_supabase/server"
import { AuthorizedError } from "../error/appError"
import { devLog } from "../util"

/** Supabaseと認証済みuserIdを返す関数ラッパー */
export async function withAuth<T>(
  fn: (supabase: SupabaseClient, userId: string) => Promise<T>
): Promise<T> {

  // supabaseクライアントを生成する
  const supabase = await createClient()

  // ユーザIDを取得する
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    devLog("withAuth.ユーザIDの取得に失敗: ", error)
    throw error
  }
  const userId = user?.id
  if (!userId) throw new AuthorizedError("ユーザIDが存在しませんでした。")

  // supabaseとuserIdを渡して関数を実行する
  return fn(supabase, userId)
}
