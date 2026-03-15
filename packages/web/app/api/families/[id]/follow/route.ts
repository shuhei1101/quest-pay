import { NextResponse } from "next/server"
import { insertFollow, deleteFollow } from "./db"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { AppError, ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { logger } from "@/app/(core)/logger"

/** フォローを追加する */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('フォロー追加API開始', {
      path: '/api/families/[id]/follow',
      method: 'POST',
    })

    const { id: followFamilyId } = await context.params

    // 認証コンテキストを取得する
    const { userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId, followFamilyId })
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo?.profiles?.type !== "parent") {
      logger.warn('親以外のフォロー試行', {
        userId,
        profileType: userInfo?.profiles?.type,
      })
      throw new ServerError("親のみアクセス可能です。")
    }
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    const followerFamilyId = userInfo.profiles.familyId

    // 自分自身をフォローできないようにする
    if (followerFamilyId === followFamilyId) {
      logger.warn('自分自身をフォローしようとする試行', { familyId: followerFamilyId })
      throw new AppError("INVALID_OPERATION", 400, "自分自身をフォローすることはできません。")
    }

    // フォローを追加する
    await insertFollow({
      db,
      followerFamilyId,
      followFamilyId,
    })
    logger.debug('フォロー追加完了', { followerFamilyId, followFamilyId })

    logger.info('フォロー追加成功', { followerFamilyId, followFamilyId })

    return NextResponse.json({ success: true })
  })
}

/** フォローを解除する */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('フォロー解除API開始', {
      path: '/api/families/[id]/follow',
      method: 'DELETE',
    })

    const { id: followFamilyId } = await context.params

    // 認証コンテキストを取得する
    const { userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId, followFamilyId })
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo?.profiles?.type !== "parent") {
      logger.warn('親以外のフォロー解除試行', {
        userId,
        profileType: userInfo?.profiles?.type,
      })
      throw new ServerError("親のみアクセス可能です。")
    }
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    const followerFamilyId = userInfo.profiles.familyId

    // フォローを解除する
    await deleteFollow({
      db,
      followerFamilyId,
      followFamilyId,
    })
    logger.debug('フォロー解除完了', { followerFamilyId, followFamilyId })

    logger.info('フォロー解除成功', { followerFamilyId, followFamilyId })

    return NextResponse.json({ success: true })
  })
}
