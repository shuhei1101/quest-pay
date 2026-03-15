import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { PostFamilyInviteRequestScheme } from "./scheme"
import { sendFamilyInviteCode } from "./service"
import { fetchFamily } from "../query"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { logger } from "@/app/(core)/logger"

/** メールを送信する */
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族招待メール送信API開始', {
      path: '/api/families/invite',
      method: 'POST',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // bodyからメールアドレスを取得する
    const body = await request.json()
    const data  = PostFamilyInviteRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { email: data.form.email })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })
      
    // 家族情報を取得する
    const family = await fetchFamily({
      familyId: userInfo.profiles.familyId,
      db
    })

    if(!family) throw new ServerError("家族の取得に失敗しました。")
    logger.debug('家族情報取得完了', { familyId: userInfo.profiles.familyId })

    // メールアドレスに家族招待コードを送信する
    await sendFamilyInviteCode({
      email: data.form.email,
      familyInviteCode: family.families.inviteCode,
    })
    logger.debug('招待メール送信完了', { email: data.form.email })

    logger.info('家族招待メール送信成功', { email: data.form.email })

    return NextResponse.json({})
  })
}
