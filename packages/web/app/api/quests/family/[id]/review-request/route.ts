import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { fetchFamilyQuest } from "../../query"
import { reviewRequest } from "../../service"

/** 家族クエストを完了報告する */
export const ReviewRequestRequestScheme = z.object({
  updatedAt: z.string(),
  requestMessage: z.string().optional(),
})
export type ReviewRequestRequest = z.infer<typeof ReviewRequestRequestScheme>
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
      const data = ReviewRequestRequestScheme.parse(body)

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
      if (!userInfo?.children?.id) throw new ServerError("子供IDの取得に失敗しました。")

      // 現在の家族クエストを取得する
      const currentFamilyQuest = await fetchFamilyQuest({ db, id })

      // 家族IDが一致しない場合
      if (userInfo.profiles.familyId !== currentFamilyQuest?.base?.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
        
      // 家族クエストを更新する
      await reviewRequest({
        db,
        familyQuestId: id,
        updatedAt: data.updatedAt,
        childId: userInfo.children.id,
        requestMessage: data.requestMessage,
        familyId: userInfo.profiles.familyId,
      })
      
      return NextResponse.json({})
    })
}
