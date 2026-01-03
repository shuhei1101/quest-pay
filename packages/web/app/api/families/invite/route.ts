import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { PostFamilyInviteRequestScheme } from "./scheme"
import { sendFamilyInviteCode } from "./service"
import { fetchFamily } from "../query"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** メールを送信する */
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // bodyからメールアドレスを取得する
      const body = await request.json()
      const data  = PostFamilyInviteRequestScheme.parse(body)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 家族情報を取得する
      const family = await fetchFamily({
        familyId: userInfo.profiles.familyId,
        db
      })

      if(!family) throw new ServerError("家族の取得に失敗しました。")

      // メールアドレスに家族招待コードを送信する
      await sendFamilyInviteCode({
        email: data.form.email,
        familyInviteCode: family.inviteCode
      })

      return NextResponse.json({})
    })
}
