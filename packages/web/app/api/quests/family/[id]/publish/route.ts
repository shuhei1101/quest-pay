import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyQuest } from "../../query"
import { registerPublicQuestByFamilyQuest } from "../../../public/service"


/** 家族クエストを公開する */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // 現在の家族クエストを取得する
      const currentFamilyQuest = await fetchFamilyQuest({ db, id })

      // 家族IDが一致しない場合
      if (userInfo.profiles.familyId !== currentFamilyQuest?.base.familyId) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
        
      // 家族クエストを更新する
      await registerPublicQuestByFamilyQuest({
        db,
        familyQuestId: id
      })
      
      return NextResponse.json({})
    })
}
