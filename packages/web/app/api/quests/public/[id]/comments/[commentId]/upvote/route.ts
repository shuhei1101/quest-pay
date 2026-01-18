import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { upvoteComment, removeCommentVote } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** コメントに高評価を付ける */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      throw new ServerError("親ユーザのみ評価できます。")
    }

    // 高評価を付ける
    await upvoteComment({
      commentId,
      profileId: userInfo.profiles.id,
      db,
    })

    return NextResponse.json({})
  })
}

/** コメントの高評価を取り消す */
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

    // 評価を削除する
    await removeCommentVote({
      commentId,
      profileId: userInfo.profiles.id,
      db,
    })

    return NextResponse.json({})
  })
}
