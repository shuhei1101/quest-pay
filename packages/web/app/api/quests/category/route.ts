import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchQuestCategories } from "./query"
import { logger } from "@/app/(core)/logger"

/** クエストカテゴリを取得する */
export type GetQuestCategoriesResponse = {
  questCategories: Awaited<ReturnType<typeof fetchQuestCategories>>
}
export async function GET(
  req: Request,
) {
  return withRouteErrorHandling(async () => {
    logger.info('クエストカテゴリ取得API開始', {
      path: '/api/quests/category',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // クエストカテゴリを取得する
    const data = await fetchQuestCategories({ db })
    logger.debug('クエストカテゴリ取得完了', { count: data.length })

    logger.info('クエストカテゴリ取得成功', { count: data.length })

    return NextResponse.json({questCategories: data} as GetQuestCategoriesResponse)
  })
}
