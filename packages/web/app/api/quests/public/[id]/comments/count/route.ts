import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicQuestCommentsCount } from "../query"
import { logger } from "@/app/(core)/logger"

/** コメント数を取得する */
export type GetPublicQuestCommentsCountResponse = {
  count: number
}
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストコメント数取得API開始', {
      path: '/api/quests/public/[id]/comments/count',
      method: 'GET',
    })

    const { db } = await getAuthContext()
    const { id } = await context.params

    // コメント数を取得する
    const count = await fetchPublicQuestCommentsCount({
      publicQuestId: id,
      db,
    })
    logger.debug('コメント数取得完了', { publicQuestId: id, count })

    logger.info('公開クエストコメント数取得成功', { publicQuestId: id, count })

    return NextResponse.json({ count } as GetPublicQuestCommentsCountResponse)
  })
}
