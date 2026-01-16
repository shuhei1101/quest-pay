import { PublicQuestComments } from "./PublicQuestComments"
import { AUTH_ERROR_URL } from "@/app/(core)/endpoints"
import { redirect } from "next/navigation"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 認証コンテキストを取得する
  const { db, userId } = await getAuthContext()
  
  // プロフィール情報を取得する
  const userInfo = await fetchUserInfoByUserId({ userId, db })
  
  // 親ユーザのみアクセス可能
  if (userInfo.profiles.type !== "parent") {
    redirect(AUTH_ERROR_URL)
  }

  return <PublicQuestComments id={id} />
}
