import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchChildQuest } from "../query"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"

/** 子供クエストを取得する */
export type GetChildQuestResponse = {
  childQuest: Awaited<ReturnType<typeof fetchChildQuest>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
      if (!userInfo?.children?.id) throw new ServerError("子供IDの取得に失敗しました。")
      
      devLog("GetChildQuest.パラメータ.ID: ", { id: params.id, childId: userInfo.children.id })
      
      // 子供クエストを取得する
      const data = await fetchChildQuest({ db, familyQuestId: params.id, childId: userInfo.children.id })
      
      devLog("取得した子供クエスト: ", data)
  
      return NextResponse.json({childQuest: data} as GetChildQuestResponse)
    })
}
