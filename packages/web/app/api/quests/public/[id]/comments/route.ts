import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicQuestComments } from "./query"
import { createPublicQuestComment } from "./service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"

/** コメント一覧を取得する */
export type GetPublicQuestCommentsResponse = {
  comments: Awaited<ReturnType<typeof fetchPublicQuestComments>>
}
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { id } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // コメント一覧を取得する
    const comments = await fetchPublicQuestComments({
      publicQuestId: id,
      db,
      profileId: userInfo.profiles.id,
    })

    return NextResponse.json({ comments } as GetPublicQuestCommentsResponse)
  })
}

/** コメントを投稿する */
export type PostPublicQuestCommentRequest = {
  content: string
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { id } = await context.params
    const body: PostPublicQuestCommentRequest = await request.json()

    devLog("PostPublicQuestComment.パラメータ: ", { id, body })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      throw new ServerError("親ユーザのみコメントできます。")
    }

    // コメントを投稿する
    const comment = await createPublicQuestComment({
      publicQuestId: id,
      profileId: userInfo.profiles.id,
      content: body.content,
      db,
    })

    return NextResponse.json({ comment })
  })
}
