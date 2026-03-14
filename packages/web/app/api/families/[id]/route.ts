import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyDetail, FamilyDetailResponse } from "./service"
import { logger } from "@/app/(core)/logger"

/** 家族詳細情報を取得する */
export type GetFamilyDetailResponse = FamilyDetailResponse

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: familyId } = await context.params
    logger.info('家族詳細取得API開始', {
      familyId,
      method: 'GET',
    })

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    const authContext = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId: authContext.userId })

    // 家族詳細情報を取得する
    const familyDetail = await fetchFamilyDetail({ db, familyId })
    logger.debug('家族詳細取得完了', { 
      familyId,
      hasChildren: !!familyDetail.family,
    })

    logger.info('家族詳細取得API完了', { familyId })
    return NextResponse.json(familyDetail as GetFamilyDetailResponse)
  })
}
