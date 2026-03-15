import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { upvoteComment, removeCommentVote, getCommentById } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** コメントに高評価を付ける */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメント高評価API開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/upvote',
      method: 'POST',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外のコメント高評価試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみ評価できます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // コメント情報を取得する
    const comment = await getCommentById({ commentId, db })
    if (!comment) {
      throw new ServerError("コメントが見つかりません。")
    }

    // 自分のコメントには評価できない
    if (comment.profileId === userInfo.profiles.id) {
      logger.warn('自分のコメントに高評価試行', {
        userId,
        commentId,
      })
      throw new ServerError("自分のコメントには評価できません。")
    }

    // 高評価を付ける
    await upvoteComment({
      commentId,
      profileId: userInfo.profiles.id,
      db,
    })
    logger.debug('高評価追加完了', { commentId })

    logger.info('コメント高評価成功', { commentId })

    return NextResponse.json({})
  })
}

/** コメントの高評価を取り消す */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('コメント高評価解除API開始', {
      path: '/api/quests/public/[id]/comments/[commentId]/upvote',
      method: 'DELETE',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // 評価を削除する
    await removeCommentVote({
      commentId,
      profileId: userInfo.profiles.id,
      db,
    })
    logger.debug('高評価削除完了', { commentId })

    logger.info('コメント高評価解除成功', { commentId })

    return NextResponse.json({})
  })
}
