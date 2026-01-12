import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyParents } from "./query"
import { fetchUserInfoByUserId } from "../users/query"


/** 家族の親を取得する */
export type GetParentsResponse = {
  parents: Awaited<ReturnType<typeof fetchFamilyParents>>
}
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 親を取得する
      const result = await fetchFamilyParents({db, familyId: userInfo.profiles.familyId })
  
      return NextResponse.json({parents: result} as GetParentsResponse)
    })
}
