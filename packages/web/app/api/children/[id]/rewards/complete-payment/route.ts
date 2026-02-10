import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { updateRewardHistoriesPaymentStatus } from "../db"
import { fetchChild } from "../../../query"
import { fetchUserInfoByUserId } from "../../../../users/query"
import z from "zod"

/** 支払い完了リクエスト */
const CompletePaymentRequest = z.object({
  yearMonth: z.string()
})

/** 支払いを完了する */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const params = await context.params
    const childId = params.id

    const body = await req.json()
    const { yearMonth } = CompletePaymentRequest.parse(body)

    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    const child = await fetchChild({ db, childId })
    if (!child) throw new ServerError("子供情報の取得に失敗しました。")

    if (userInfo.profiles.familyId !== child.profiles?.familyId) {
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }

    if (userInfo.profiles.type === 'parent') {
      throw new ServerError("子供ユーザのみが支払い完了を実行できます。")
    }

    if (child.profiles?.id !== userInfo.profiles.id) {
      throw new ServerError("自分自身の報酬のみ受取完了できます。")
    }

    await updateRewardHistoriesPaymentStatus({
      db,
      childId,
      yearMonth,
      isPaid: true,
      paidAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  })
}
