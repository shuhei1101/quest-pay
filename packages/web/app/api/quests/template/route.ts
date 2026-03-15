import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { TemplateQuestSearchParamsScheme, fetchTemplateQuests } from "./query"
import queryString from "query-string"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { logger } from "@/app/(core)/logger"

/** テンプレートクエストを取得する */
export type GetTemplateQuestsResponse = Awaited<ReturnType<typeof fetchTemplateQuests>>
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('テンプレートクエスト一覧取得API開始', {
      path: '/api/quests/template',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

      // クエリパラメータを取得する
      const url = new URL(req.url)
      const query = queryString.parse(url.search)
      const params = TemplateQuestSearchParamsScheme.parse(query)
      logger.debug('クエリパラメータ検証完了', { params })

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
      logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })
  
      // クエストを取得する
      const result = await fetchTemplateQuests({db, params, familyId: userInfo.profiles.familyId})
      logger.debug('テンプレートクエスト取得完了', { count: result.rows.length })
  
      logger.info('テンプレートクエスト一覧取得成功', { count: result.rows.length })

      return NextResponse.json(result as GetTemplateQuestsResponse)
  })
}
