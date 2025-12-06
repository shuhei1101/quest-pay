"use client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { usersLoginGet } from "@/app/api/users/login/client"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/app/(core)/_supabase/client"
import { useRouter } from "next/navigation"
import { LOGIN_URL } from "@/app/(core)/constants"
import { ClientAuthError } from "@/app/(core)/appError"
import { Session } from "@supabase/supabase-js"

/** ログインユーザの情報を取得する */
export const useLoginUserInfo = ({ caching = true }: {
  caching?: boolean
} = {}) => {
  const router = useRouter()

  const query = useQuery({
    queryKey: ["loginUser"],
    retry: false,
    queryFn: async () => {
      let session: Session | null = null
      // キャッシュ有効の場合、セッションストレージからセッションを取得する
      if (caching) session = appStorage.supabaseSession.get()
      // セッションがない場合、Supabaseからセッション状態を取得する
      if (!session) {
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
        // セッションを設定する
        session = data.session
      }
      
      // セッションストレージからユーザ情報を取得する
      let userInfo = appStorage.user.get()
      // ユーザ情報がない場合
      if (!userInfo) {
        // ユーザ情報を取得する
        const data = await usersLoginGet()
        userInfo = data.userInfo
        // セッションストレージに格納する
        if (!userInfo) {
          // フィードバックメッセージを表示する
          appStorage.feedbackMessage.set("ユーザ情報の取得に失敗しました。再度ログインしてください。")
          // ログイン画面に遷移する
          router.push(LOGIN_URL)
          // 認証エラーを発生させる
          throw new ClientAuthError("ユーザ情報の取得に失敗")
        }
        appStorage.user.set(userInfo)
      }
    return userInfo
    }
  })

  return {
    userInfo: query.data,
    isLoading: query.isLoading
  }

}
