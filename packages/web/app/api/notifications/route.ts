import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchNotifications } from "./query"
import { fetchUserInfoByUserId } from "../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** 通知一覧を取得する */
export type GetNotificationsResponse = {
  notifications: Awaited<ReturnType<typeof fetchNotifications>>
}
export async function GET() {
  return withRouteErrorHandling(async () => {
    logger.info('通知一覧取得API開始', {
      method: 'GET',
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.id) throw new ServerError("プロフィールIDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // 通知を取得する
    const notifications = await fetchNotifications({
      db,
      profileId: userInfo.profiles.id
    })
    logger.debug('通知取得完了', { notificationsCount: notifications.length })

    logger.info('通知一覧取得API完了', {
      notificationsCount: notifications.length,
    })
    return NextResponse.json({ notifications } as GetNotificationsResponse)
  })
}
