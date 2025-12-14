import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { NextResponse } from "next/server"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { GetLoginUserResponse } from "./schema"

/** ユーザを取得する */
export async function GET() {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // ユーザ情報を取得する
      const userInfo = await fetchUserInfoByUserId({ supabase, userId })
  
      return NextResponse.json({ userInfo } as GetLoginUserResponse)
    })
  })
}
