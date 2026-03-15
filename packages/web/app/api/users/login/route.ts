import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId, UserInfo } from "@/app/api/users/query"
import { NextResponse } from "next/server"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { logger } from "@/app/(core)/logger"

export type GetLoginUserResponse = {
  userInfo: UserInfo
}

/** ユーザを取得する */
export async function GET() {
  return withRouteErrorHandling(async () => {
    logger.info('ログインユーザー情報取得API開始', {
      path: '/api/users/login',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // ユーザ情報を取得する
    const userInfo = await fetchUserInfoByUserId({ db, userId })
    logger.debug('ユーザー情報取得完了', {
      userId,
      familyId: userInfo?.profiles?.familyId,
    })

    logger.info('ログインユーザー情報取得成功', { userId })

    return NextResponse.json({ userInfo } as GetLoginUserResponse)
  })
}
