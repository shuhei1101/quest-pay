import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicQuestComments } from "./query"
import { createPublicQuestComment } from "./service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** コメント一覧を取得する */
export type GetPublicQuestCommentsResponse = {
  comments: Awaited<ReturnType<typeof fetchPublicQuestComments>>
}
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストコメント一覧取得API開始', {
      path: '/api/quests/public/[id]/comments',
      method: 'GET',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { id } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // コメント一覧を取得する
    const comments = await fetchPublicQuestComments({
      publicQuestId: id,
      db,
      profileId: userInfo.profiles.id,
    })
    logger.debug('コメント一覧取得完了', { publicQuestId: id, count: comments.length })

    logger.info('公開クエストコメント一覧取得成功', { publicQuestId: id, count: comments.length })

    return NextResponse.json({ comments } as GetPublicQuestCommentsResponse)
  })
}

/** コメントを投稿する */
export type PostPublicQuestCommentRequest = {
  content: string
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストコメント投稿API開始', {
      path: '/api/quests/public/[id]/comments',
      method: 'POST',
    })

    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    const { id } = await context.params
    const body: PostPublicQuestCommentRequest = await request.json()
    logger.debug('リクエストボディ検証完了', { publicQuestId: id })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外のコメント投稿試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみコメントできます。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // コメントを投稿する
    const comment = await createPublicQuestComment({
      publicQuestId: id,
      profileId: userInfo.profiles.id,
      content: body.content,
      db,
    })
    logger.debug('コメント投稿完了', { publicQuestId: id, commentId: comment.id })

    logger.info('公開クエストコメント投稿成功', { publicQuestId: id, commentId: comment.id })

    return NextResponse.json({ comment })
  })
}
