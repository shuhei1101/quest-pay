import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { rejectReport } from "@/app/api/quests/family/service"
import { fetchChildQuest } from "../../query"
import { logger } from "@/app/(core)/logger"

/** 報告を却下する */
export const RejectReportRequestScheme = z.object({
  responseMessage: z.string().optional(),
  updatedAt: z.string(),
})
export type RejectReportRequest = z.infer<typeof RejectReportRequestScheme>

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string, childId: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('子供クエスト却下API開始', {
      path: '/api/quests/family/[id]/child/[childId]/reject',
      method: 'PUT',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // パスパラメータからIDを取得する
    const { id, childId } = await context.params

    // bodyからリクエストを取得する
    const body = await req.json()
    const data = RejectReportRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { familyQuestId: id, childId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.id) throw new ServerError("プロフィールIDの取得に失敗しました。")
    if (userInfo.profiles.type !== "parent") {
      logger.warn('親以外の却下試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザ以外は実行できません。")
    }
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // クエスト子供を取得する
    const questChild = await fetchChildQuest({ db, familyQuestId: id, childId })
    if (!questChild) throw new ServerError("クエストが見つかりません。")
    
    // 家族メンバーシップを確認する
    if (userInfo.families?.id !== questChild.base.familyId) {
      logger.warn('異なる家族のクエスト却下試行', {
        userId,
        userFamilyId: userInfo.families?.id,
        questFamilyId: questChild.base.familyId,
      })
      throw new ServerError("このクエストを操作する権限がありません。")
    }

    // 報告を却下する
    await rejectReport({
      db,
      familyQuestId: id,
      childId,
      responseMessage: data.responseMessage,
      profileId: userInfo.profiles.id,
      updatedAt: data.updatedAt,
    })
    logger.debug('報告却下完了', { familyQuestId: id, childId })
    
    logger.info('子供クエスト却下成功', { familyQuestId: id, childId })

    return NextResponse.json({})
  })
}
