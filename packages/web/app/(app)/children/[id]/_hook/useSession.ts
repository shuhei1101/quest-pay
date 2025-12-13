"use client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/app/(core)/_supabase/client"
import { useRouter } from "next/navigation"
import { LOGIN_URL } from "@/app/(core)/constants"
import { ClientAuthError } from "@/app/(core)/error/appError"

/** セッション情報を取得する */
export const useSession = () => {
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    retry: false,
    queryFn: async () => {
      // セッション情報を取得する
      const { data } = await createClient().auth.getSession()
      // セッション状態がない場合
      if (!data.session) {
        // フィードバックメッセージを表示する
        appStorage.feedbackMessage.set("セッションが切れました。再度ログインしてください。")
        // ログイン画面に遷移する
        router.push(LOGIN_URL)
        // 認証エラーを発生させる
        throw new ClientAuthError()
      }
      return {
        session: data.session
      }
    }
  })

  return {
    session: data?.session,
    isLoading
  }

}
