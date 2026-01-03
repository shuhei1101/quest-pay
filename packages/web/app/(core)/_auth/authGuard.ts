import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { getAuthContext } from "./withAuth"
import { AUTH_ERROR_URL } from "../endpoints"
import { redirect } from "next/navigation"

export const authGuard = async ({parentNG = false, childNG = false, guestNG = false}: {
  parentNG?: boolean
  childNG?: boolean
  guestNG?: boolean
}) => {
  // 認証コンテキストを取得する
  const { db, userId } = await getAuthContext()
  // ユーザ情報を取得する
  const userInfo = await fetchUserInfoByUserId({db, userId})

  if ((guestNG && !userInfo) ||
    (parentNG && userInfo?.profiles?.type === "parent") || 
    (childNG && userInfo?.profiles?.type === "child")
  ) {
    // 権限エラー画面に遷移する
    redirect(AUTH_ERROR_URL)
  }
  
  return { userInfo }
}
