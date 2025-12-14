import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfoByUserId, fetchProfileByChildInviteCode } from "@/app/api/users/query"
import { NextRequest, NextResponse } from "next/server"
import { JoinChildRequestSchema } from "./schema"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { ServerError } from "@/app/(core)/error/appError"
import { updateProfile } from "../../db"

/** 子として参加する */
export async function POST(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // bodyから家族クエストを取得する
      const body = await req.json()
      const data = JoinChildRequestSchema.parse(body)

      // 招待コードから子供情報を取得する
      const profile = await fetchProfileByChildInviteCode({ supabase, inviteCode: data.invite_code })

      // 子供情報が存在しない場合
      if (!profile || !profile.id) throw new ServerError("招待コードが無効です。")

      // 子供とユーザIDを紐づける
      await updateProfile({
        supabase,
        profile: {
          ...profile,
          user_id: userId
        }
      })

      return NextResponse.json({})
    })
  })
}
