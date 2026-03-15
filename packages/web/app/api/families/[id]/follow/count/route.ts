import { NextResponse } from "next/server"
import { fetchFollowCount } from "../query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { logger } from "@/app/(core)/logger"

/** フォロワー数とフォロー数を取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('フォロー数取得API開始', {
      path: '/api/families/[id]/follow/count',
      method: 'GET',
    })

    const { id: familyId } = await context.params

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { familyId })

    // フォロー数を取得する
    const counts = await fetchFollowCount({
      db,
      familyId,
    })
    logger.debug('フォロー数取得完了', {
      followerCount: counts.followerCount,
      followingCount: counts.followingCount,
    })

    logger.info('フォロー数取得成功', {
      familyId,
      followerCount: counts.followerCount,
      followingCount: counts.followingCount,
    })

    return NextResponse.json(counts)
  })
}
