"use client"
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";
import { appStorage } from "../../(core)/_sessionStorage/appStorage";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/app/(core)/appConstants";
import { fetchUser } from "../../(user)/_query/userQuery";

export const useAuthCheck = () => {
  const router = useRouter()
  
  /** 現在の認証状態を確認する */
  const checkAuth = async () => {
    // セッションストレージからセッション情報を取得する
    let session = appStorage.supabaseSession.get()
    if (!session) {
      const { data } = await clientSupabase.auth.getSession();
      // ログインに失敗した場合
      if (!data.session) {
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('セッションが切れました。再度ログインしてください。')
          
        // ログイン画面に戻る
        router.push(`${LOGIN_URL}`)
        return {}
      }
      // ログインに成功した場合、セッションストレージに格納する
      session = data.session
      appStorage.supabaseSession.set(session)
    }

    // セッションストレージからユーザ情報を取得する
    let userInfo = appStorage.user.get()
    if (!userInfo) {
    // ユーザ情報を取得する
      userInfo = await fetchUser(session.user.id)
      // ユーザ情報が取得できた場合、セッションストレージに格納する
      if (userInfo) appStorage.user.set(userInfo)
    }
  
    return {
      userInfo,
      userId: session.user.id,
    }
  }
  return { checkAuth }
}
