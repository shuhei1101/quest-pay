import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfo } from "@/app/api/users/login/query"
import { NextResponse } from "next/server"
import { UsersLoginGetResponse } from "./schema"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** ユーザを取得する */
export async function GET() {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // ユーザ情報を取得する
      const userInfo = await fetchUserInfo({ supabase, userId })
  
      return NextResponse.json({ userInfo } as UsersLoginGetResponse)
    })
  })
}
