import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchTemplateQuestByPublicQuestId } from "@/app/api/quests/template/query"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** 公開クエストIDから自身の家族が保有するテンプレートクエストを取得する */
export type GetTemplateQuestByPublicQuestIdResponse = {
  templateQuest: Awaited<ReturnType<typeof fetchTemplateQuestByPublicQuestId>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストからテンプレートクエスト取得API開始', {
      path: '/api/quests/template/public/[id]',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

      // パスパラメータからIDを取得する
      const { id } = await context.params
      logger.debug('パスパラメータ取得完了', { publicQuestId: id })
      
      
      // ユーザ情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
      logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

      // テンプレートクエストを取得する
      const templateQuest = await fetchTemplateQuestByPublicQuestId({ db, publicQuestId: id, familyId: userInfo.profiles.familyId })
      logger.debug('テンプレートクエスト取得完了', { exists: !!templateQuest })
      
  
      logger.info('公開クエストからテンプレートクエスト取得成功', { publicQuestId: id })

      return NextResponse.json({templateQuest} as GetTemplateQuestByPublicQuestIdResponse)
    })
}
