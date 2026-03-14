import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchRewardHistories, fetchRewardHistoryMonthlyStats } from "./query"
import { fetchChild } from "../../../query"
import { fetchUserInfoByUserId } from "../../../../users/query"
import { logger } from "@/app/(core)/logger"

/** 報酬履歴を取得する */
export type GetRewardHistoriesResponse = {
  histories: Awaited<ReturnType<typeof fetchRewardHistories>>
  monthlyStats: Awaited<ReturnType<typeof fetchRewardHistoryMonthlyStats>>
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('報酬履歴取得API開始', {
      path: '/api/children/[id]/reward/histories',
      method: 'GET',
    })

    const { db, userId } = await getAuthContext()
    const params = await context.params
    const childId = params.id
    logger.debug('認証コンテキスト取得完了', { userId, childId })

    const { searchParams } = new URL(req.url)
    const yearMonth = searchParams.get('yearMonth') || undefined
    logger.debug('クエリパラメーター取得完了', { yearMonth })

    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    const child = await fetchChild({ db, childId })
    if (!child) throw new ServerError("子供情報の取得に失敗しました。")
    logger.debug('子供情報取得完了', { childId })

    if (userInfo.profiles.familyId !== child.profiles?.familyId) {
      logger.warn('家族不一致のアクセス検出', {
        userFamilyId: userInfo.profiles.familyId,
        childFamilyId: child.profiles?.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }

    const histories = await fetchRewardHistories({ db, childId, yearMonth })
    logger.debug('報酬履歴取得完了', { historiesCount: histories.length })

    const monthlyStats = await fetchRewardHistoryMonthlyStats({ db, childId })
    logger.debug('月別統計取得完了', { monthlyStatsCount: monthlyStats.length })

    logger.info('報酬履歴取得成功', {
      childId,
      historiesCount: histories.length,
      monthlyStatsCount: monthlyStats.length,
    })

    return NextResponse.json({ histories, monthlyStats } as GetRewardHistoriesResponse)
  })
}
