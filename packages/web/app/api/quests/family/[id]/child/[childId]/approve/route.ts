import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { approveReport } from "@/app/api/quests/family/service"
import { fetchChildQuest } from "../../query"

/** 報告を受領する */
export const ApproveReportRequestScheme = z.object({
  responseMessage: z.string().optional(),
  updatedAt: z.string(),
})
export type ApproveReportRequest = z.infer<typeof ApproveReportRequestScheme>

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string, childId: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    
    // パスパラメータからIDを取得する
    const { id, childId } = await context.params

    // bodyからリクエストを取得する
    const body = await req.json()
    const data = ApproveReportRequestScheme.parse(body)

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.id) throw new ServerError("プロフィールIDの取得に失敗しました。")
    if (userInfo.profiles.type !== "parent") throw new ServerError("親ユーザ以外は実行できません。")

    // クエスト子供を取得する
    const questChild = await fetchChildQuest({ db, familyQuestId: id, childId })
    if (!questChild) throw new ServerError("クエストが見つかりません。")
    
    // 家族メンバーシップを確認する
    if (userInfo.families?.id !== questChild.base.familyId) {
      throw new ServerError("このクエストを操作する権限がありません。")
    }

    // 報告を受領する
    await approveReport({
      db,
      familyQuestId: id,
      childId,
      responseMessage: data.responseMessage,
      profileId: userInfo.profiles.id,
      updatedAt: data.updatedAt,
    })
    
    return NextResponse.json({})
  })
}
