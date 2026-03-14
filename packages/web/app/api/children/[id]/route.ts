import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchChild, fetchChildQuestStats, fetchChildRewardStats, fetchChildFixedReward } from "../query"
import { fetchUserInfoByUserId } from "../../users/query"
import { calculateAge } from "@/app/(core)/util"
import { logger } from "@/app/(core)/logger"


/** 子供を取得する */
export type GetChildResponse = {
  child: Awaited<ReturnType<typeof fetchChild>>
  questStats: Awaited<ReturnType<typeof fetchChildQuestStats>>
  rewardStats: Awaited<ReturnType<typeof fetchChildRewardStats>>
  fixedReward: Awaited<ReturnType<typeof fetchChildFixedReward>>
}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // パスパラメータからIDを取得する
    const params = await context.params
    const childId = params.id
    logger.info('子供詳細取得API開始', {
      childId,
      path: req.nextUrl.pathname,
      method: req.method,
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId, childId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('家族ID取得完了', { familyId: userInfo.profiles.familyId })

    // 子供を取得する
    const data = await fetchChild({db, childId })

    // 取得に失敗した場合
    if (!data) throw new ServerError("子供情報の取得に失敗しました。")

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== data.profiles?.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    logger.debug('子供情報取得完了', { childId, name: data.profiles?.name })

    // クエスト統計を取得する
    const questStats = await fetchChildQuestStats({db, childId})
    logger.debug('クエスト統計取得完了', { childId })

    // 報酬統計を取得する
    const rewardStats = await fetchChildRewardStats({db, childId})
    logger.debug('報酬統計取得完了', { childId })

    // 年齢を計算する
    const age = calculateAge(data.profiles?.birthday)
    const level = data.children?.currentLevel ?? 1
    logger.debug('年齢とレベル計算完了', { childId, age, level })

    // 定額報酬を取得する
    const fixedReward = await fetchChildFixedReward({db, childId, age, level})
    logger.debug('定額報酬取得完了', { childId })

    logger.info('子供詳細取得API完了', { childId })
    return NextResponse.json({
      child: data, 
      questStats,
      rewardStats,
      fixedReward
    } as GetChildResponse)
  })
}
