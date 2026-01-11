import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchPublicQuestByFamilyId } from "../../../public/query"

/** 公開クエストを取得する */
export type GetPublicQuestByFamilyQuestIdResponse = {
  publicQuest: Awaited<ReturnType<typeof fetchPublicQuestByFamilyId>>
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
      
      devLog("GetPublicQuestByFamilyQuestId.パラメータ.ID: ", params.id)
      
      // 公開クエストを取得する
      const data = await fetchPublicQuestByFamilyId({ db, familyQuestId: params.id })
      
      devLog("取得した公開クエスト: ", data)
  
      return NextResponse.json({publicQuest: data} as GetPublicQuestByFamilyQuestIdResponse)
    })
}
