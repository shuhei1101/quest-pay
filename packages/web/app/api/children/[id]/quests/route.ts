import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { ChildQuestSearchParamsScheme, fetchChildQuests } from "../../../quests/family/[id]/child/query"
import queryString from "query-string"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { ChildSelect } from "@/drizzle/schema"
import { fetchChild } from "../../query"
import { devLog } from "@/app/(core)/util"

/** 子供のクエストを取得する */
export type GetChildQuestsResponse = Awaited<ReturnType<typeof fetchChildQuests>>
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: ChildSelect["id"] }> }
) {
  return withRouteErrorHandling(async () => {
    // パスパラメータからIDを取得する
    const { id: childId } = await context.params
    devLog("GetChildQuestsAPI.childId: ", childId)
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // クエリパラメータを取得する
    const url = new URL(req.url)
    const query = queryString.parse(url.search)
    const params = ChildQuestSearchParamsScheme.parse(query)

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.children?.id) throw new ServerError("ユーザ情報の取得に失敗しました。")

    // 子供情報を取得する
    const child = await fetchChild({ db, childId })

    if (userInfo.profiles.type === "parent") {
      // 親ユーザかつ子供が所属する家族IDと親ユーザの家族IDが一致しない場合、エラーを返す
      if (child?.profiles?.familyId !== userInfo.profiles.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    } else {
      // 子供ユーザかつログインユーザの子供IDとアクセスしている子供IDが一致しない場合、エラーを返す
      if (userInfo.children.id !== childId) throw new ServerError("他の子供のデータにアクセスしました。")
    }

    // クエストを取得する
    const result = await fetchChildQuests({db, childId, params, familyId: userInfo.profiles.familyId})

    return NextResponse.json(result as GetChildQuestsResponse)
  })
}
