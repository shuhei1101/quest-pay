import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchIconCategories } from "./query"
import { GetIconCategoriesResponse } from "./schema"

/** アイコンを取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase) => {
      // アイコンを取得する
      const result = await fetchIconCategories({supabase})
  
      return NextResponse.json({iconCategories: result} as GetIconCategoriesResponse)
    })
  })
}
