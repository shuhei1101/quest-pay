import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchChild } from "../query"
import { fetchUserInfoByUserId } from "../../users/query"
import { GetChildResponse } from "./schema"


/** 子供を取得する */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // パスパラメータからIDを取得する
      const params = await context.params
      const childId = params.id

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 子供を取得する
      const data = await fetchChild({supabase, childId })

      // 取得に失敗した場合
      if (!data) throw new ServerError("子供情報の取得に失敗しました。")
  
      // 家族IDが一致しない場合
      if (userInfo.family_id !== data.family_id) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")

      return NextResponse.json({child: data} as GetChildResponse)
    })
  })
}
