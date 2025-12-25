import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchParentsByFamilyId } from "./query"
import { GetParentsResponse } from "./scheme"
import { fetchUserInfoByUserId } from "../users/query"


/** 家族の親を取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.families?.id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 親を取得する
      const result = await fetchParentsByFamilyId({db, familyId: userInfo.families.id })
  
      return NextResponse.json({parents: result} as GetParentsResponse)
    })
}
