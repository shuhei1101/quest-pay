import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { likeByPublisher, unlikeByPublisher } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { fetchPublicQuest } from "@/app/api/quests/public/query"
import { logger } from "@/app/(core)/logger"

/** コメントに公開者いいねを付ける */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメント公開者いいねAPI開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/publisher-like',
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
      logger.warn('親以外の公開者いいね試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみ公開者いいねできます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // 公開クエスト情報を取得する
    const publicQuest = await fetchPublicQuest({ id: publicQuestId, db })
    if (!publicQuest) throw new ServerError("公開クエストの取得に失敗しました。")

    // 公開クエストの家族に所属しているか確認する
    if (publicQuest.base.familyId !== userInfo.profiles.familyId) {
      logger.warn('異なる家族のコメント公開者いいね試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: publicQuest.base.familyId,
      })
      throw new ServerError("この公開クエストの家族に所属していません。")
    }

    // 公開者いいねを付ける
    await likeByPublisher({
      commentId,
      db,
    })
    logger.debug('公開者いいね完了', { commentId })

    logger.info('コメント公開者いいね成功', { commentId })

    return NextResponse.json({})
  })
}

/** コメントの公開者いいねを解除する */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメント公開者いいね解除API開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/publisher-like',
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
      logger.warn('親以外の公開者いいね解除試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみ公開者いいね解除できます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // 公開者いいねを解除する
    await unlikeByPublisher({
      commentId,
      db,
    })
    logger.debug('公開者いいね解除完了', { commentId })

    logger.info('コメント公開者いいね解除成功', { commentId })

    return NextResponse.json({})
  })
}
