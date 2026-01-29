import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { reportComment } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** コメントを報告する */
export type PostCommentReportRequest = {
  reason: string
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { commentId } = await context.params
    const body: PostCommentReportRequest = await request.json()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      throw new ServerError("親ユーザのみ報告できます。")
    }

    // コメントを報告する
    await reportComment({
      commentId,
      profileId: userInfo.profiles.id,
      reason: body.reason,
      db,
    })

    return NextResponse.json({})
  })
}
