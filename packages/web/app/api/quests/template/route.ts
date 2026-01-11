import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { TemplateQuestSearchParamsScheme, fetchTemplateQuests } from "./query"
import queryString from "query-string"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** テンプレートクエストを取得する */
export type GetTemplateQuestsResponse = Awaited<ReturnType<typeof fetchTemplateQuests>>
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // クエリパラメータを取得する
      const url = new URL(req.url)
      const query = queryString.parse(url.search)
      const params = TemplateQuestSearchParamsScheme.parse(query)

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
  
      // クエストを取得する
      const result = await fetchTemplateQuests({db, params, familyId: userInfo.profiles.familyId})
  
      return NextResponse.json(result as GetTemplateQuestsResponse)
  })
}
