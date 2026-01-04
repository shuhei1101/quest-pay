import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { deactivatePublicQuest } from "../../service"
import { fetchPublicQuest } from "../../query"

/** 公開クエストを無効化する */
export const DeactivatePublicQuestRequestScheme = z.object({
  updatedAt: z.string(),
})
export type DeactivatePublicQuestRequest = z.infer<typeof DeactivatePublicQuestRequestScheme>
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params

      // bodyから公開クエストを取得する
      const body = await req.json()
      const data = DeactivatePublicQuestRequestScheme.parse(body)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // 現在の公開クエストを取得する
      const currentPublicQuest = await fetchPublicQuest({ db, id })

      // 家族IDが一致しない場合
      if (userInfo.profiles.familyId !== currentPublicQuest?.familyQuest?.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
        
      // 公開クエストを更新する
      await deactivatePublicQuest({
        db,
        publicQuest: {
          id,
          updatedAt: data.updatedAt,
        },
      })
      
      return NextResponse.json({})
    })
}
