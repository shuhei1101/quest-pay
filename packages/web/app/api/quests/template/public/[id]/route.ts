import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchTemplateQuestByPublicQuestId } from "@/app/api/quests/template/query"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** 公開クエストIDから自身の家族が保有するテンプレートクエストを取得する */
export type GetTemplateQuestByPublicQuestIdResponse = {
  templateQuest: Awaited<ReturnType<typeof fetchTemplateQuestByPublicQuestId>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params
      
      devLog("GetPublicQuest.パラメータ.ID: ", id)
      
      // ユーザ情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // テンプレートクエストを取得する
      const templateQuest = await fetchTemplateQuestByPublicQuestId({ db, publicQuestId: id, familyId: userInfo.profiles.familyId })
      
      devLog("取得したテンプレートクエスト: ", templateQuest)
  
      return NextResponse.json({templateQuest} as GetTemplateQuestByPublicQuestIdResponse)
    })
}
