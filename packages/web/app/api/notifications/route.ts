import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchNotifications } from "./query"
import { fetchUserInfoByUserId } from "../users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** 通知一覧を取得する */
export type GetNotificationsResponse = {
  notifications: Awaited<ReturnType<typeof fetchNotifications>>
}
export async function GET() {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.id) throw new ServerError("プロフィールIDの取得に失敗しました。")

    // 通知を取得する
    const notifications = await fetchNotifications({
      db,
      profileId: userInfo.profiles.id
    })

    return NextResponse.json({ notifications } as GetNotificationsResponse)
  })
}
