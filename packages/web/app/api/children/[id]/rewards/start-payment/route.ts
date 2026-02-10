import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { updateRewardHistoriesPaymentStatus } from "../db"
import { fetchChild } from "../../../query"
import { fetchUserInfoByUserId } from "../../../../users/query"
import z from "zod"

/** 支払い開始リクエスト */
const StartPaymentRequest = z.object({
  yearMonth: z.string()
})

/** 支払いを開始する */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const params = await context.params
    const childId = params.id

    const body = await req.json()
    const { yearMonth } = StartPaymentRequest.parse(body)

    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    if (userInfo.profiles.type !== 'parent') {
      throw new ServerError("親ユーザのみが支払いを開始できます。")
    }

    const child = await fetchChild({ db, childId })
    if (!child) throw new ServerError("子供情報の取得に失敗しました。")

    if (userInfo.profiles.familyId !== child.profiles?.familyId) {
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }

    await updateRewardHistoriesPaymentStatus({
      db,
      childId,
      yearMonth,
      isPaid: false,
      paidAt: null
    })

    return NextResponse.json({ success: true })
  })
}
