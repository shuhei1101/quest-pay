import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { getAuthContext } from "./withAuth"
import { AUTH_ERROR_URL } from "../endpoints"
import { redirect } from "next/navigation"

export const authGuard = async ({parentNG, childNG, guestNG}: {
  parentNG?: boolean
  childNG?: boolean
  guestNG?: boolean
}) => {
  // 認証コンテキストを取得する
  const { supabase, userId } = await getAuthContext()
  // ユーザ情報を取得する
  const userInfo = await fetchUserInfoByUserId({supabase, userId})

  if ((guestNG && !userInfo) ||
    (parentNG && userInfo?.user_type === "parent") || 
    (childNG && userInfo?.user_type === "child")
  ) {
    // 権限エラー画面に遷移する
    redirect(AUTH_ERROR_URL)
  }
  
  return { userInfo }
}
