import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { getAuthContext } from "./withAuth"
import { LOGIN_URL, QUESTS_URL } from "../endpoints"
import { redirect } from "next/navigation"
import { addQueryParam } from "../util"

export const authGuard = async ({parentNG = false, childNG = false, guestNG = false, redirectUrl}: {
  parentNG?: boolean
  childNG?: boolean
  guestNG?: boolean
  redirectUrl?: string
}) => {
  // 認証コンテキストを取得する
  const { db, userId } = await getAuthContext()
  // ユーザ情報を取得する
  const userInfo = await fetchUserInfoByUserId({db, userId})

  if ((guestNG && !userInfo) ||
    (parentNG && userInfo?.profiles?.type === "parent") || 
    (childNG && userInfo?.profiles?.type === "child")
  ) {
    // エラーメッセージをクエリパラメータに付与する
    const targetUrl = redirectUrl || LOGIN_URL
    const urlWithError = addQueryParam(targetUrl, 'error', 'このページにアクセスする権限がありません')
    
    // 指定されたURLまたはクエスト画面に遷移する
    redirect(urlWithError)
  }
  
  return {
    userInfo,
    isGuest: !userInfo,
    isParent: userInfo?.profiles?.type === "parent",
    isChild: userInfo?.profiles?.type === "child",
  
  }
}
