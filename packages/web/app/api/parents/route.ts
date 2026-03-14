import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyParents } from "./query"
import { fetchUserInfoByUserId } from "../users/query"
import { logger } from "@/app/(core)/logger"


/** 家族の親を取得する */
export type GetParentsResponse = {
  parents: Awaited<ReturnType<typeof fetchFamilyParents>>
}
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('親一覧取得API開始', {
      path: req.nextUrl.pathname,
      method: req.method,
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('家族ID取得完了', { familyId: userInfo.profiles.familyId })

    // 親を取得する
    const result = await fetchFamilyParents({db, familyId: userInfo.profiles.familyId })
    logger.debug('親取得完了', { 
      familyId: userInfo.profiles.familyId,
      parentsCount: result.length,
    })
    
    logger.info('親一覧取得API完了', {
      parentsCount: result.length,
    })
    return NextResponse.json({parents: result} as GetParentsResponse)
  })
}
