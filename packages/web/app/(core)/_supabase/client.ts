import { createBrowserClient } from '@supabase/ssr'

/** ログイン状態の保持設定に応じたSupabaseクライアントを作成する */
export function createClient(rememberMe?: boolean) {
  // rememberMeが明示的に指定されていない場合はデフォルトのクライアントを返す
  if (rememberMe === undefined) {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // rememberMeがfalseの場合はsessionStorageを使用する
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: rememberMe ? window.localStorage : window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
      }
    }
  )
}
