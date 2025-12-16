"use client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { getLoginUser } from "@/app/api/users/login/client"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/app/(core)/_supabase/client"
import { Session } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"

/** ログインユーザの情報を取得する */
export const useLoginUserInfo = ({ caching = true }: {
  caching?: boolean
} = {}) => {

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
        if (!data.session) return { isGuest: true }
        // セッションを設定する
        session = data.session
      }
      
      // セッションストレージからユーザ情報を取得する
      let userInfo = appStorage.user.get()
      // ユーザ情報がない場合
      if (!userInfo) {
        // ユーザ情報を取得する
        const { userInfo } = await getLoginUser()
        if (!userInfo) return { isGuest: true }
        // セッションストレージに格納する
        appStorage.user.set(userInfo)
      }
      return {
        userInfo,
        isGuest: false,
      }
    }
  })

  return {
    userInfo: query.data?.userInfo,
    isGuest: query.data?.isGuest ?? true,
    isParent: query.data?.userInfo?.user_type === "parent",
    isChild: query.data?.userInfo?.user_type === "child",
    isLoading: query.isLoading,
    refetch: query.refetch
  }
}
