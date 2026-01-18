import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchChildQuest } from "../query"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { deleteQuestChild } from "../db"

/** 子供クエストを取得する */
export type GetChildQuestResponse = {
  childQuest: Awaited<ReturnType<typeof fetchChildQuest>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string, childId: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
      
      // 子供クエストを取得する
      const data = await fetchChildQuest({ db, familyQuestId: params.id, childId: params.childId })
      
      devLog("取得した子供クエスト: ", data)
  
      return NextResponse.json({childQuest: data} as GetChildQuestResponse)
    })
}

/** 子供クエストを削除する（進捗リセット） */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string, childId: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // パスパラメータからIDを取得する
    const params = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo.profiles.type !== "parent") throw new ServerError("親ユーザのみ削除が可能です。")

    // 子供クエストを削除する
    await deleteQuestChild({ db, familyQuestId: params.id, childId: params.childId })

    devLog("子供クエストを削除しました: ", params)

    return NextResponse.json({})
  })
}
