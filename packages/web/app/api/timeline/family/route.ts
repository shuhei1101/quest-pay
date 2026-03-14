import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyTimelines } from "./query"
import { fetchUserInfoByUserId } from "../../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"

/** 家族タイムライン一覧を取得する */
export type GetFamilyTimelinesResponse = {
  timelines: Awaited<ReturnType<typeof fetchFamilyTimelines>>
}
export async function GET() {
  return withRouteErrorHandling(async () => {
    logger.info('家族タイムライン一覧取得API開始', {
      path: '/api/timeline/family',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 家族タイムラインを取得する
    const timelines = await fetchFamilyTimelines({
      db,
      familyId: userInfo.profiles.familyId
    })
    logger.debug('家族タイムライン取得完了', {
      timelinesCount: timelines.length,
    })

    logger.info('家族タイムライン一覧取得成功', {
      timelinesCount: timelines.length,
    })

    return NextResponse.json({ timelines } as GetFamilyTimelinesResponse)
  })
}
