import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicQuestCommentsCount } from "../query"

/** コメント数を取得する */
export type GetPublicQuestCommentsCountResponse = {
  count: number
}
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { db } = await getAuthContext()
    const { id } = await context.params

    // コメント数を取得する
    const count = await fetchPublicQuestCommentsCount({
      publicQuestId: id,
      db,
    })

    return NextResponse.json({ count } as GetPublicQuestCommentsCountResponse)
  })
}
