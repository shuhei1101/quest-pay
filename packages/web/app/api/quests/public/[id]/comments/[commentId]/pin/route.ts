import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { pinComment, unpinComment } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { fetchPublicQuest } from "@/app/api/quests/public/query"
import { logger } from "@/app/(core)/logger"

/** コメントをピン留めする */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメントピン留めAPI開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/pin',
      method: 'POST',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { id: publicQuestId, commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外のピン留め試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみピン留めできます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // 公開クエスト情報を取得する
    const publicQuest = await fetchPublicQuest({ id: publicQuestId, db })
    if (!publicQuest) throw new ServerError("公開クエストの取得に失敗しました。")

    // 公開クエストの家族に所属しているか確認する
    if (publicQuest.base.familyId !== userInfo.profiles.familyId) {
      logger.warn('異なる家族のコメントピン留め試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: publicQuest.base.familyId,
      })
      throw new ServerError("この公開クエストの家族に所属していません。")
    }

    // ピン留めする
    await pinComment({
      commentId,
      publicQuestId,
      db,
    })
    logger.debug('ピン留め完了', { commentId, publicQuestId })

    logger.info('コメントピン留め成功', { commentId })

    return NextResponse.json({})
  })
}

/** コメントのピン留めを解除する */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメントピン留め解除API開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/pin',
      method: 'DELETE',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外のピン留め解除試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみピン留め解除できます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // ピン留めを解除する
    await unpinComment({
      commentId,
      db,
    })
    logger.debug('ピン留め解除完了', { commentId })

    logger.info('コメントピン留め解除成功', { commentId })

    return NextResponse.json({})
  })
}
