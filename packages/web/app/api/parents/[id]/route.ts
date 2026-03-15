import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "../../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchParent, fetchParentStats } from "../query"
import { logger } from "@/app/(core)/logger"


/** 家族の親を取得する */
export type GetParentResponse = {
  parent: Awaited<ReturnType<typeof fetchParent>>
  stats?: {
    approvedCount: number
    rejectedCount: number
  }
}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('親情報取得API開始', {
      path: '/api/parents/[id]',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const params = await context.params
    const parentId = params.id
    logger.debug('パスパラメータ取得完了', { parentId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 親を取得する
    const data = await fetchParent({db, parentId })

    // 親が存在しない場合
    if (!data) throw new ServerError("親情報の取得に失敗しました。")
    logger.debug('親情報取得完了', { parentId })

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== data.profiles?.familyId) {
      logger.warn('異なる家族の親情報へのアクセス試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        targetFamilyId: data.profiles?.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }

    // 親の統計情報を取得する
    const stats = await fetchParentStats({
      db, 
      profileId: data.profiles?.id ?? "",
      familyId: userInfo.profiles.familyId
    })
    logger.debug('親統計情報取得完了', { stats })

    logger.info('親情報取得成功', { parentId })

    return NextResponse.json({parent: data, stats} as GetParentResponse)
  })
}
