import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchQuestLikeCount } from "@/app/api/quests/template/query"
import { logger } from "@/app/(core)/logger"

/** クエストいいね数を取得する */
export type GetPublicQuestLikeCountResponse = {
  count: Awaited<ReturnType<typeof fetchQuestLikeCount>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストいいね数取得API開始', {
      path: '/api/quests/public/[id]/like/count',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const { id } = await context.params
    logger.debug('パスパラメータ取得完了', { publicQuestId: id })
    
    // クエストいいね数を取得する
    const count = await fetchQuestLikeCount({ db, publicQuestId: id })
    logger.debug('いいね数取得完了', { publicQuestId: id, count })

    logger.info('公開クエストいいね数取得成功', { publicQuestId: id, count })

    return NextResponse.json({count: count} as GetPublicQuestLikeCountResponse)
  })
}
