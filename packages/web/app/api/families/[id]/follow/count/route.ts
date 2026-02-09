import { NextResponse } from "next/server"
import { fetchFollowCount } from "../query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** フォロワー数とフォロー数を取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: familyId } = await context.params

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    await getAuthContext()

    // フォロー数を取得する
    const counts = await fetchFollowCount({
      db,
      familyId,
    })

    return NextResponse.json(counts)
  })
}
