import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { fetchNotifications } from "../query"
import { readNotifications } from "../service"
import { logger } from "@/app/(core)/logger"

/** 複数の通知を既読にする */
export const ReadNotificationsRequestScheme = z.object({
  notificationIds: z.array(z.string()),
  updatedAt: z.string(),
})
export type ReadNotificationsRequest = z.infer<typeof ReadNotificationsRequestScheme>
export async function PUT(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('通知既読API開始', {
      path: '/api/notifications/read',
      method: 'PUT',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // bodyからリクエストを取得する
    const body = await req.json()
    const data = ReadNotificationsRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { count: data.notificationIds.length })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.id) throw new ServerError("プロフィールIDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { profileId: userInfo.profiles.id })

    // 現在の通知一覧を取得する
    const currentNotifications = await fetchNotifications({ db, profileId: userInfo.profiles.id })
    logger.debug('通知一覧取得完了', { count: currentNotifications.length })
    
    // リクエストされた通知IDが全て自分の通知か確認する
    const myNotificationIds = currentNotifications.map(n => n.id)
    const isAllMyNotifications = data.notificationIds.every(id => myNotificationIds.includes(id))
    if (!isAllMyNotifications) {
      logger.warn('他ユーザーの通知へのアクセス試行', {
        userId,
        profileId: userInfo.profiles.id,
      })
      throw new ServerError("他のユーザの通知にアクセスしました。")
    }
      
    // 通知を既読にする
    await readNotifications({
      notificationIds: data.notificationIds,
      updatedAt: data.updatedAt,
      profileId: userInfo.profiles.id,
    })
    logger.debug('通知既読完了', { count: data.notificationIds.length })
    
    logger.info('通知既読成功', { count: data.notificationIds.length })

    return NextResponse.json({})
  })
}
