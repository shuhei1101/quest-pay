import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { ChildQuestSearchParamsScheme, fetchChildQuests } from "./query"
import queryString from "query-string"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 子供のクエストを取得する */
export type GetChildQuestsResponse = Awaited<ReturnType<typeof fetchChildQuests>>
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // クエリパラメータを取得する
    const url = new URL(req.url)
    const query = queryString.parse(url.search)
    const params = ChildQuestSearchParamsScheme.parse(query)

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.children?.id) throw new ServerError("ユーザ情報の取得に失敗しました。")

    // クエストを取得する
    const result = await fetchChildQuests({db, childId: userInfo.children.id, params, familyId: userInfo.profiles.familyId})

    return NextResponse.json(result as GetChildQuestsResponse)
  })
}
