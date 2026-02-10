import { NextResponse } from "next/server"
import { fetchFamilyTimelines } from "../query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import type { GetFamilyTimelinesResponse } from "../route"

/** 家族タイムラインを取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: familyId } = await context.params

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    await getAuthContext()

    // 家族タイムラインを取得する
    const timelines = await fetchFamilyTimelines({
      db,
      familyId,
      limit: 50,
    })

    return NextResponse.json({ timelines } as GetFamilyTimelinesResponse)
  })
}
