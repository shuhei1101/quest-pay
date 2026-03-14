import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicTimelines } from "./query"
import { logger } from "@/app/(core)/logger"

/** 公開タイムライン一覧を取得する */
export type GetPublicTimelinesResponse = {
  timelines: Awaited<ReturnType<typeof fetchPublicTimelines>>
}
export async function GET() {
  return withRouteErrorHandling(async () => {
    logger.info('公開タイムライン一覧取得API開始', {
      path: '/api/timeline/public',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了')

    // 公開タイムラインを取得する
    const timelines = await fetchPublicTimelines({
      db
    })
    logger.debug('公開タイムライン取得完了', {
      timelinesCount: timelines.length,
    })

    logger.info('公開タイムライン一覧取得成功', {
      timelinesCount: timelines.length,
    })

    return NextResponse.json({ timelines } as GetPublicTimelinesResponse)
  })
}
