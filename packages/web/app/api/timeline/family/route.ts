import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyTimelines } from "./query"
import { fetchUserInfoByUserId } from "../../users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** 家族タイムライン一覧を取得する */
export type GetFamilyTimelinesResponse = {
  timelines: Awaited<ReturnType<typeof fetchFamilyTimelines>>
}
export async function GET() {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    // 家族タイムラインを取得する
    const timelines = await fetchFamilyTimelines({
      db,
      familyId: userInfo.profiles.familyId
    })

    return NextResponse.json({ timelines } as GetFamilyTimelinesResponse)
  })
}
