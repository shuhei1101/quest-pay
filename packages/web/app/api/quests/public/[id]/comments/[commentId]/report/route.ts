import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { reportComment } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** コメントを報告する */
export type PostCommentReportRequest = {
  reason: string
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメント報告API開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/report',
      method: 'POST',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { commentId } = await context.params
    const body: PostCommentReportRequest = await request.json()
    logger.debug('リクエストボディ検証完了', { commentId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外のコメント報告試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみ報告できます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // コメントを報告する
    await reportComment({
      commentId,
      profileId: userInfo.profiles.id,
      reason: body.reason,
      db,
    })
    logger.debug('コメント報告完了', { commentId })

    logger.info('コメント報告成功', { commentId })

    return NextResponse.json({})
  })
}
