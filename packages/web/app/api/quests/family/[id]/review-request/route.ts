import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { fetchFamilyQuest } from "../../query"
import { reviewRequest } from "../../service"
import { logger } from "@/app/(core)/logger"

/** 家族クエストを完了報告する */
export const ReviewRequestRequestScheme = z.object({
  updatedAt: z.string(),
  requestMessage: z.string().optional(),
})
export type ReviewRequestRequest = z.infer<typeof ReviewRequestRequestScheme>
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('クエスト完了報告API開始', {
      path: '/api/quests/family/[id]/review-request',
      method: 'PUT',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const { id } = await context.params

    // bodyから公開クエストを取得する
    const body = await req.json()
    const data = ReviewRequestRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { familyQuestId: id })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (!userInfo?.children?.id) throw new ServerError("子供IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId, childId: userInfo.children.id })

    // 現在の家族クエストを取得する
    const currentFamilyQuest = await fetchFamilyQuest({ db, id })

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== currentFamilyQuest?.base?.familyId) {
      logger.warn('異なる家族のクエスト完了報告試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: currentFamilyQuest?.base?.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }
      
    // 家族クエストを更新する
    await reviewRequest({
      db,
      familyQuestId: id,
      updatedAt: data.updatedAt,
      childId: userInfo.children.id,
      requestMessage: data.requestMessage,
      familyId: userInfo.profiles.familyId,
    })
    logger.debug('完了報告完了', { familyQuestId: id, childId: userInfo.children.id })
    
    logger.info('クエスト完了報告成功', { familyQuestId: id })

    return NextResponse.json({})
  })
}
