import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { fetchNotifications } from "../query"
import { readNotifications } from "../service"

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
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

      // bodyからリクエストを取得する
      const body = await req.json()
      const data = ReadNotificationsRequestScheme.parse(body)

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.id) throw new ServerError("プロフィールIDの取得に失敗しました。")

      // 現在の通知一覧を取得する
      const currentNotifications = await fetchNotifications({ db, profileId: userInfo.profiles.id })
      
      // リクエストされた通知IDが全て自分の通知か確認する
      const myNotificationIds = currentNotifications.map(n => n.id)
      const isAllMyNotifications = data.notificationIds.every(id => myNotificationIds.includes(id))
      if (!isAllMyNotifications) throw new ServerError("他のユーザの通知にアクセスしました。")
        
      // 通知を既読にする
      await readNotifications({
        notificationIds: data.notificationIds,
        updatedAt: data.updatedAt,
        profileId: userInfo.profiles.id,
      })
      
      return NextResponse.json({})
    })
}
