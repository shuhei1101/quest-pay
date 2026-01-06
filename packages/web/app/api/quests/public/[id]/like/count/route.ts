import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchQuestLikeCount } from "@/app/api/quests/template/query"

/** クエストいいね数を取得する */
export type GetPublicQuestLikeCountResponse = {
  count: Awaited<ReturnType<typeof fetchQuestLikeCount>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params
      
      devLog("GetPublicQuest.パラメータ.ID: ", id)
      
      // クエストいいね数を取得する
      const count = await fetchQuestLikeCount({ db, publicQuestId: id })
      
      devLog("取得したクエストいいね数: ", count)
  
      return NextResponse.json({count: count} as GetPublicQuestLikeCountResponse)
    })
}
