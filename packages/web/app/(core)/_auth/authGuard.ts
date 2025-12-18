import { fetchProfile, fetchUserInfoByUserId } from "@/app/api/users/query"
import { ClientAuthError } from "../error/appError"
import { getAuthContext } from "./withAuth"

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
  ) throw new ClientAuthError("画面の閲覧権限がありません。")
  
  return { userInfo }
}
