import { NextResponse } from "next/server"
import { fetchFollowStatus } from "../query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** フォロー状態を取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('フォロー状態取得API開始', {
      path: '/api/families/[id]/follow/status',
      method: 'GET',
    })

    const { id: followFamilyId } = await context.params

    // 認証コンテキストを取得する
    const { userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId, followFamilyId })
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo?.profiles?.type !== "parent") {
      logger.warn('親以外のフォロー状態取得試行', {
        userId,
        profileType: userInfo?.profiles?.type,
      })
      throw new ServerError("親のみアクセス可能です。")
    }
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    const followerFamilyId = userInfo.profiles.familyId

    // フォロー状態を取得する
    const isFollowing = await fetchFollowStatus({
      db,
      followerFamilyId,
      followFamilyId,
    })
    logger.debug('フォロー状態取得完了', { isFollowing })

    logger.info('フォロー状態取得成功', {
      followerFamilyId,
      followFamilyId,
      isFollowing,
    })

    return NextResponse.json({ isFollowing })
  })
}
