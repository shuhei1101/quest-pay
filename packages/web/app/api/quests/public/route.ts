import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { PublicQuestSearchParamsScheme, fetchPublicQuests } from "./query"
import queryString from "query-string"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { logger } from "@/app/(core)/logger"

/** 公開のクエストを取得する */
export type GetPublicQuestsResponse = Awaited<ReturnType<typeof fetchPublicQuests>>
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエスト一覧取得API開始', {
      path: req.nextUrl.pathname,
      method: req.method,
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // クエリパラメータを取得する
    const url = new URL(req.url)
    const query = queryString.parse(url.search)
    const params = PublicQuestSearchParamsScheme.parse(query)
    logger.debug('クエリパラメータ解析完了', { params })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('家族ID取得完了', { familyId: userInfo.profiles.familyId })
    
    // クエストを取得する
    const result = await fetchPublicQuests({db, params, familyId: userInfo.profiles.familyId})
    logger.debug('公開クエスト取得完了', { 
      familyId: userInfo.profiles.familyId,
      questsCount: result.rows.length,
      totalRecords: result.totalRecords,
    })
    
    logger.info('公開クエスト一覧取得API完了', {
      questsCount: result.rows.length,
      totalRecords: result.totalRecords,
    })
    return NextResponse.json(result as GetPublicQuestsResponse)
  })
}
