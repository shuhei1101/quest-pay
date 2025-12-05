import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfo } from "@/app/api/users/login/query"
import { NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { UsersLoginGetResponse } from "./schema"

/** ユーザを取得する */
export async function GET() {
  return withAuth(async (supabase, userId) => {
    try {
      // ユーザ情報を取得する
      const userInfo = await fetchUserInfo({ supabase, userId })
  
      return NextResponse.json({ userInfo } as UsersLoginGetResponse)
    } catch (err) {
      return handleServerError(err)
    }
  })
}
