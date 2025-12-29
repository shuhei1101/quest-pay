import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchQuestCategories } from "./query"

/** クエストカテゴリを取得する */
export type GetQuestCategoriesResponse = {
  questCategories: Awaited<ReturnType<typeof fetchQuestCategories>>
}
export async function GET(
  req: Request,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      
      // クエストカテゴリを取得する
      const data = await fetchQuestCategories({ db })
      
      devLog("取得したクエストカテゴリ: ", data)
  
      return NextResponse.json({questCategories: data} as GetQuestCategoriesResponse)
    })
}
