import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchIconCategories } from "./query"
import { logger } from "@/app/(core)/logger"

/** アイコンを取得する */
export type GetIconCategoriesResponse = {
  iconCategories: Awaited<ReturnType<typeof fetchIconCategories>>
}
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('アイコンカテゴリー一覧取得API開始', {
      path: '/api/icons/category',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // アイコンを取得する
    const iconCategories = await fetchIconCategories({db})
    logger.debug('アイコンカテゴリー取得完了', { categoriesCount: iconCategories.length })

    logger.info('アイコンカテゴリー一覧取得成功', { categoriesCount: iconCategories.length })
  
    return NextResponse.json({iconCategories} as GetIconCategoriesResponse)
  })
}
