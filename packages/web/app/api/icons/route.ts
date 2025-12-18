import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchIcons } from "./query"
import { GetIconsResponse } from "./scheme"

/** アイコンを取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { supabase, userId } = await getAuthContext()
      // アイコンを取得する
      const result = await fetchIcons({supabase})
  
      return NextResponse.json({icons: result} as GetIconsResponse)
    })
}
