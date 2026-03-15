import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { fetchChild } from "@/app/api/children/query"
import { updateRewardHistoriesPaymentStatus } from "../../histories/db"
import { logger } from "@/app/(core)/logger"

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
    logger.info('報酬支払い完了API開始', {
      path: '/api/children/[id]/reward/pay/complete',
      method: 'POST',
    })

    const { db, userId } = await getAuthContext()
    const params = await context.params
    const childId = params.id
    logger.debug('認証コンテキスト取得完了', { userId, childId })

    const body = await req.json()
    const { yearMonth } = CompletePaymentRequest.parse(body)
    logger.debug('リクエストパラメーター取得完了', { yearMonth })

    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('ユーザー情報取得完了', { familyId: userInfo.profiles.familyId, profileType: userInfo.profiles.type })

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

    if (userInfo.profiles.type === 'parent') {
      logger.warn('親ユーザーの支払い完了試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("子供ユーザのみが支払い完了を実行できます。")
    }

    if (child.profiles?.id !== userInfo.profiles.id) {
      logger.warn('他ユーザーの報酬受取試行', {
        childProfileId: child.profiles?.id,
        userProfileId: userInfo.profiles.id,
      })
      throw new ServerError("自分自身の報酬のみ受取完了できます。")
    }

    await updateRewardHistoriesPaymentStatus({
      db,
      childId,
      yearMonth,
      isPaid: true,
      paidAt: new Date().toISOString()
    })
    logger.debug('報酬履歴支払いステータス更新完了', { childId, yearMonth })

    logger.info('報酬支払い完了成功', { childId, yearMonth })

    return NextResponse.json({ success: true })
  })
}
