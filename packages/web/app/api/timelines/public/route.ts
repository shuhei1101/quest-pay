import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicTimelines } from "./query"

/** 公開タイムライン一覧を取得する */
export type GetPublicTimelinesResponse = {
  timelines: Awaited<ReturnType<typeof fetchPublicTimelines>>
}
export async function GET() {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db } = await getAuthContext()

    // 公開タイムラインを取得する
    const timelines = await fetchPublicTimelines({
      db
    })

    return NextResponse.json({ timelines } as GetPublicTimelinesResponse)
  })
}
