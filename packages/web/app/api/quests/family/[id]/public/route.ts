import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicQuestByFamilyId } from "../../../public/query"
import { logger } from "@/app/(core)/logger"

/** 公開クエストを取得する */
export type GetPublicQuestByFamilyQuestIdResponse = {
  publicQuest: Awaited<ReturnType<typeof fetchPublicQuestByFamilyId>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族クエストの公開状態取得API開始', {
      path: '/api/quests/family/[id]/public',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const params = await context.params
    logger.debug('パスパラメータ取得完了', { familyQuestId: params.id })
    
    // 公開クエストを取得する
    const data = await fetchPublicQuestByFamilyId({ db, familyQuestId: params.id })
    logger.debug('公開クエスト取得完了', { familyQuestId: params.id, exists: !!data })

    logger.info('家族クエストの公開状態取得成功', { familyQuestId: params.id })

    return NextResponse.json({publicQuest: data} as GetPublicQuestByFamilyQuestIdResponse)
  })
}
