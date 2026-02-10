import { NextResponse } from "next/server"
import { fetchFollowStatus } from "../query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** フォロー状態を取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: followFamilyId } = await context.params

    // 認証コンテキストを取得する
    const { userId } = await getAuthContext()
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo?.profiles?.type !== "parent") throw new ServerError("親のみアクセス可能です。")

    const followerFamilyId = userInfo.profiles.familyId

    // フォロー状態を取得する
    const isFollowing = await fetchFollowStatus({
      db,
      followerFamilyId,
      followFamilyId,
    })

    return NextResponse.json({ isFollowing })
  })
}
