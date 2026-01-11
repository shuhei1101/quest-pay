import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { activatePublicQuest } from "../../service"
import { fetchPublicQuest } from "../../query"

/** 公開クエストを有効化する */
export const ActivatePublicQuestRequestScheme = z.object({
  updatedAt: z.string(),
})
export type ActivatePublicQuestRequest = z.infer<typeof ActivatePublicQuestRequestScheme>
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
      const data = ActivatePublicQuestRequestScheme.parse(body)

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // 現在の公開クエストを取得する
      const currentPublicQuest = await fetchPublicQuest({ db, id })

      // 家族IDが一致しない場合
      if (userInfo.profiles.familyId !== currentPublicQuest?.familyQuest?.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
        
      // 公開クエストを更新する
      await activatePublicQuest({
        db,
        publicQuest: {
          id,
          updatedAt: data.updatedAt,
        },
      })
      
      return NextResponse.json({})
    })
}
