import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchIcons } from "./query"
import { GetIconsResponse } from "./scheme"

/** アイコンを取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase) => {
      // アイコンを取得する
      const result = await fetchIcons({supabase})
  
      return NextResponse.json({icons: result} as GetIconsResponse)
    })
  })
}
