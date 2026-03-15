import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchIcons } from "./query"
import { logger } from "@/app/(core)/logger"

/** アイコンを取得する */
export type GetIconsResponse = {
  icons: Awaited<ReturnType<typeof fetchIcons>>
}

export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('アイコン一覧取得API開始', {
      path: '/api/icons',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // アイコンを取得する
    const result = await fetchIcons({db})
    logger.debug('アイコン取得完了', { iconsCount: result.length })

    logger.info('アイコン一覧取得成功', { iconsCount: result.length })
  
    return NextResponse.json({icons: result} as GetIconsResponse)
  })
}
