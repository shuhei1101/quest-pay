import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { deletePublicQuestComment } from "../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** コメントを削除する */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // コメントを削除する
    await deletePublicQuestComment({
      commentId,
      profileId: userInfo.profiles.id,
      db,
    })

    return NextResponse.json({})
  })
}
