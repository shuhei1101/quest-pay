import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { registerTemplateQuestByPublicQuest } from "../../../template/service"


/** 公開クエストをいいねする */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // パスパラメータからIDを取得する
    const { id } = await context.params

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // 公開クエストをテンプレートクエストとして登録する（いいねする）
      await registerTemplateQuestByPublicQuest({
        db,
        publicQuestId: id,
        familyId: userInfo.profiles.familyId
      })
      
      return NextResponse.json({})
    })
}
