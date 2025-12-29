import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId, UserInfo } from "@/app/api/users/query"
import { NextResponse } from "next/server"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

export type GetLoginUserResponse = {
  userInfo: UserInfo
}

/** ユーザを取得する */
export async function GET() {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // ユーザ情報を取得する
    const userInfo = await fetchUserInfoByUserId({ db, userId })

    return NextResponse.json({ userInfo } as GetLoginUserResponse)
  })
}
