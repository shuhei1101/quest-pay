import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { fetchChild } from "@/app/api/children/query"
import { logger } from "@/app/(core)/logger"

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
    logger.info('報酬支払い開始API開始', {
      path: '/api/children/[id]/reward/pay/start',
      method: 'POST',
    })

    const { db, userId } = await getAuthContext()
    const params = await context.params
    const childId = params.id
    logger.debug('認証コンテキスト取得完了', { userId, childId })

    const body = await req.json()
    const { yearMonth } = StartPaymentRequest.parse(body)
    logger.debug('リクエストパラメーター取得完了', { yearMonth })

    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('ユーザー情報取得完了', { familyId: userInfo.profiles.familyId, profileType: userInfo.profiles.type })

    if (userInfo.profiles.type !== 'parent') {
      logger.warn('親以外の支払い開始試行', {
        userId,
        profileType: userInfo.profiles.type,
      })
      throw new ServerError("親ユーザのみが支払いを開始できます。")
    }

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

    // 支払い開始時は何もせず、子供が受取完了を押したときにisPaidをtrueにする
    // （現在のDBスキーマでは支払い中状態を表現するフィールドがないため）
    logger.debug('支払い開始処理完了(ステータス更新なし)', { childId, yearMonth })

    logger.info('報酬支払い開始成功', { childId, yearMonth })

    return NextResponse.json({ success: true })
  })
}
