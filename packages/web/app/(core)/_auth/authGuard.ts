import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { getAuthContext } from "./withAuth"
import { QUESTS_URL } from "../endpoints"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

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
    // Cookieに権限エラーメッセージを設定する
    const cookieStore = await cookies()
    cookieStore.set('accessError', 'このページにアクセスする権限がありません', { 
      path: '/',
      maxAge: 10,
      sameSite: 'lax'
    })
    
    // 指定されたURLまたはクエスト画面に遷移する
    redirect(redirectUrl || QUESTS_URL)
  }
  
  return {
    userInfo,
    isGuest: !userInfo,
    isParent: userInfo?.profiles?.type === "parent",
    isChild: userInfo?.profiles?.type === "child",
  
  }
}
