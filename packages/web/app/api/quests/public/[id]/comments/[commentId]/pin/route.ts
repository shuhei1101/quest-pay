import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { pinComment, unpinComment } from "../../service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { fetchPublicQuest } from "@/app/api/quests/public/query"

/** コメントをピン留めする */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { id: publicQuestId, commentId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles) throw new ServerError("プロフィール情報の取得に失敗しました。")

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      throw new ServerError("親ユーザのみピン留めできます。")
    }

    // 公開クエスト情報を取得する
    const publicQuest = await fetchPublicQuest({ id: publicQuestId, db })
    if (!publicQuest) throw new ServerError("公開クエストの取得に失敗しました。")

    // 公開クエストの家族に所属しているか確認する
    if (publicQuest.base.familyId !== userInfo.profiles.familyId) {
      throw new ServerError("この公開クエストの家族に所属していません。")
    }

    // ピン留めする
    await pinComment({
      commentId,
      publicQuestId,
      db,
    })

    return NextResponse.json({})
  })
}

/** コメントのピン留めを解除する */
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

    // 親ユーザのみ許可する
    if (userInfo.profiles.type !== "parent") {
      throw new ServerError("親ユーザのみピン留め解除できます。")
    }

    // ピン留めを解除する
    await unpinComment({
      commentId,
      db,
    })

    return NextResponse.json({})
  })
}
