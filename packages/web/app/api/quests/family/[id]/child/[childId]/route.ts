import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchChildQuest } from "../query"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { deleteQuestChild } from "../db"
import { logger } from "@/app/(core)/logger"

/** 子供クエストを取得する */
export type GetChildQuestResponse = {
  childQuest: Awaited<ReturnType<typeof fetchChildQuest>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string, childId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('子供クエスト取得API開始', {
      path: '/api/quests/family/[id]/child/[childId]',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const params = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })
    
    // 子供クエストを取得する
    const data = await fetchChildQuest({ db, familyQuestId: params.id, childId: params.childId })
    logger.debug('子供クエスト取得完了', { familyQuestId: params.id, childId: params.childId })

    logger.info('子供クエスト取得成功', { familyQuestId: params.id, childId: params.childId })

    return NextResponse.json({childQuest: data} as GetChildQuestResponse)
  })
}

/** 子供クエストを削除する（進捗リセット） */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string, childId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('子供クエスト削除API開始', {
      path: '/api/quests/family/[id]/child/[childId]',
      method: 'DELETE',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const params = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外の子供クエスト削除試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみ削除が可能です。")
    }
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 子供クエストを削除する
    await deleteQuestChild({ db, familyQuestId: params.id, childId: params.childId })
    logger.debug('子供クエスト削除完了', { familyQuestId: params.id, childId: params.childId })

    logger.info('子供クエスト削除成功', { familyQuestId: params.id, childId: params.childId })

    return NextResponse.json({})
  })
}
