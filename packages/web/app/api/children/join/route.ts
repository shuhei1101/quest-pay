import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { NextRequest, NextResponse } from "next/server"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { ServerError } from "@/app/(core)/error/appError"
import { linkProfileAndUser } from "../../users/db"
import { fetchChildByInviteCode } from "../query"
import z from "zod"
import { logger } from "@/app/(core)/logger"

/** 子として参加する */
export const JoinChildRequestSchema = z.object({
  invite_code: z.string().min(1, "招待コードは必須です。")
})
export type JoinChildRequest = z.infer<typeof JoinChildRequestSchema>
export async function POST(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('子供参加API開始', {
      path: '/api/children/join',
      method: 'POST',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // bodyから家族クエストを取得する
    const body = await req.json()
    const data = JoinChildRequestSchema.parse(body)
    logger.debug('招待コード検証完了')

    // 招待コードから子供情報を取得する
    const child = await fetchChildByInviteCode({ db, invite_code: data.invite_code })

    // 子供情報が存在しない場合
    if (!child || !child.id) {
      logger.warn('無効な招待コード', { inviteCode: data.invite_code })
      throw new ServerError("招待コードが無効です。")
    }
    logger.debug('子供情報取得完了', { childId: child.id, profileId: child.profileId })

    // 子供とユーザIDを紐づける
    await linkProfileAndUser({db,
      profileId: child.profileId,
      userId
    })
    logger.debug('プロフィールとユーザー紐付け完了', { profileId: child.profileId, userId })

    logger.info('子供参加成功', { childId: child.id, userId })

    return NextResponse.json({})
  })
}
