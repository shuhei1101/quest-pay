import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchRewardHistories, fetchRewardHistoryMonthlyStats } from "./query"
import { fetchChild } from "../../query"
import { fetchUserInfoByUserId } from "../../../users/query"

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
    const { db, userId } = await getAuthContext()
    const params = await context.params
    const childId = params.id

    const { searchParams } = new URL(req.url)
    const yearMonth = searchParams.get('yearMonth') || undefined

    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    const child = await fetchChild({ db, childId })
    if (!child) throw new ServerError("子供情報の取得に失敗しました。")

    if (userInfo.profiles.familyId !== child.profiles?.familyId) {
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }

    const histories = await fetchRewardHistories({ db, childId, yearMonth })
    const monthlyStats = await fetchRewardHistoryMonthlyStats({ db, childId })

    return NextResponse.json({ histories, monthlyStats } as GetRewardHistoriesResponse)
  })
}
