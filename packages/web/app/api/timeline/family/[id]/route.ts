import { NextResponse } from "next/server"
import { fetchFamilyTimelines } from "../query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import type { GetFamilyTimelinesResponse } from "../route"
import { logger } from "@/app/(core)/logger"

/** 家族タイムラインを取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族タイムライン取得API開始', {
      path: '/api/timeline/family/[id]',
      method: 'GET',
    })

    const { id: familyId } = await context.params
    logger.debug('パスパラメータ取得完了', { familyId })

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    await getAuthContext()
    logger.debug('認証確認完了')

    // 家族タイムラインを取得する
    const timelines = await fetchFamilyTimelines({
      db,
      familyId,
      limit: 50,
    })
    logger.debug('タイムライン取得完了', { count: timelines.length })

    logger.info('家族タイムライン取得成功', { familyId, count: timelines.length })

    return NextResponse.json({ timelines } as GetFamilyTimelinesResponse)
  })
}
