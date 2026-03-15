import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { deletePublicQuestComment } from "../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** コメントを削除する */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストコメント削除API開始', {
      path: '/api/quests/public/[id]/comments/[commentId]',
      method: 'DELETE',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // コメントを削除する
    await deletePublicQuestComment({
      commentId,
      profileId: userInfo.profiles.id,
      db,
    })
    logger.debug('コメント削除完了', { commentId })

    logger.info('公開クエストコメント削除成功', { commentId })

    return NextResponse.json({})
  })
}
