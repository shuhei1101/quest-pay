import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchChild, fetchChildQuestStats, fetchChildRewardStats, fetchChildFixedReward } from "../query"
import { fetchUserInfoByUserId } from "../../users/query"
import { calculateAge } from "@/app/(core)/util"


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
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // パスパラメータからIDを取得する
    const params = await context.params
    const childId = params.id

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    // 子供を取得する
    const data = await fetchChild({db, childId })

    // 取得に失敗した場合
    if (!data) throw new ServerError("子供情報の取得に失敗しました。")

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== data.profiles?.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")

    // クエスト統計を取得する
    const questStats = await fetchChildQuestStats({db, childId})

    // 報酬統計を取得する
    const rewardStats = await fetchChildRewardStats({db, childId})

    // 年齢を計算する
    const age = calculateAge(data.profiles?.birthday)
    const level = data.children?.currentLevel ?? 1

    // 定額報酬を取得する
    const fixedReward = await fetchChildFixedReward({db, childId, age, level})

    return NextResponse.json({
      child: data, 
      questStats,
      rewardStats,
      fixedReward
    } as GetChildResponse)
  })
}
