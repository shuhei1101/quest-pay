import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { registerTemplateQuestByPublicQuest, removeTemplateQuest } from "../../../../template/service"
import { fetchTemplateQuestByPublicQuestId } from "@/app/api/quests/template/query"


/** 公開クエストのいいねを解除する */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params

      // プロフィール情報を取得するル情報ール情報ール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // 公開クエストIDからテンプレートクエストを取得する
      const templateQuest = await fetchTemplateQuestByPublicQuestId({db, publicQuestId: id, familyId: userInfo.profiles.familyId})

      // テンプレートクエストを削除する
      await removeTemplateQuest({
        db,
        templateQuest: {
          id: templateQuest.template_quests.id,
          updatedAt: templateQuest.template_quests.updatedAt
        },
        quest: {
          updatedAt: templateQuest.quests.updatedAt
        }
      })
      
      return NextResponse.json({})
    })
}
