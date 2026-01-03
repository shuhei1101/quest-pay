import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "../../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchParent } from "../query"


/** 家族の親を取得する */
export type GetParentResponse = {
  parent: Awaited<ReturnType<typeof fetchParent>>
}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params
      const parentId = params.id

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 親を取得する
      const data = await fetchParent({db, parentId })

      // 親が存在しない場合
      if (!data) throw new ServerError("親情報の取得に失敗しました。")

      // 家族IDが一致しない場合
      if (userInfo.profiles.familyId !== data.profiles?.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
  
      return NextResponse.json({parent: data} as GetParentResponse)
    })
}
