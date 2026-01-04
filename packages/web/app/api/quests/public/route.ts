import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { PublicQuestSearchParamsScheme, fetchPublicQuests } from "./query"
import queryString from "query-string"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 公開のクエストを取得する */
export type GetPublicQuestsResponse = Awaited<ReturnType<typeof fetchPublicQuests>>
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // クエリパラメータを取得する
      const url = new URL(req.url)
      const query = queryString.parse(url.search)
      const params = PublicQuestSearchParamsScheme.parse(query)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
  
      // クエストを取得する
      const result = await fetchPublicQuests({db, params})
  
      return NextResponse.json(result as GetPublicQuestsResponse)
  })
}
