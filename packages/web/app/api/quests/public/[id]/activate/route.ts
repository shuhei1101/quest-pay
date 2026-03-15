import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { activatePublicQuest } from "../../service"
import { fetchPublicQuest } from "../../query"
import { logger } from "@/app/(core)/logger"

/** 公開クエストを有効化する */
export const ActivatePublicQuestRequestScheme = z.object({
  updatedAt: z.string(),
})
export type ActivatePublicQuestRequest = z.infer<typeof ActivatePublicQuestRequestScheme>
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエスト有効化API開始', {
      path: '/api/quests/public/[id]/activate',
      method: 'PUT',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const { id } = await context.params

    // bodyから公開クエストを取得する
    const body = await req.json()
    const data = ActivatePublicQuestRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { publicQuestId: id })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 現在の公開クエストを取得する
    const currentPublicQuest = await fetchPublicQuest({ db, id })

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== currentPublicQuest?.familyQuest?.familyId) {
      logger.warn('異なる家族の公開クエスト有効化試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: currentPublicQuest?.familyQuest?.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }
      
    // 公開クエストを更新する
    await activatePublicQuest({
      db,
      publicQuest: {
        id,
        updatedAt: data.updatedAt,
      },
    })
    logger.debug('公開クエスト有効化完了', { publicQuestId: id })
    
    logger.info('公開クエスト有効化成功', { publicQuestId: id })

    return NextResponse.json({})
  })
}
