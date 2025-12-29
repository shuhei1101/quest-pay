import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { NextRequest, NextResponse } from "next/server"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { ServerError } from "@/app/(core)/error/appError"
import { linkProfileAndUser } from "../../users/db"
import { fetchChildByInviteCode } from "../query"
import z from "zod"

/** 子として参加する */
export const JoinChildRequestSchema = z.object({
  invite_code: z.string().min(1, "招待コードは必須です。")
})
export type JoinChildRequest = z.infer<typeof JoinChildRequestSchema>
export async function POST(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // bodyから家族クエストを取得する
    const body = await req.json()
    const data = JoinChildRequestSchema.parse(body)

    // 招待コードから子供情報を取得する
    const child = await fetchChildByInviteCode({ db, invite_code: data.invite_code })

    // 子供情報が存在しない場合
    if (!child || !child.id) throw new ServerError("招待コードが無効です。")

    // 子供とユーザIDを紐づける
    await linkProfileAndUser({db,
      profileId: child.profileId,
      userId
    })

    return NextResponse.json({})
  })
}
