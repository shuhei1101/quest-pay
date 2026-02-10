import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyDetail, FamilyDetailResponse } from "./service"

/** 家族詳細情報を取得する */
export type GetFamilyDetailResponse = FamilyDetailResponse

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: familyId } = await context.params

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    await getAuthContext()

    // 家族詳細情報を取得する
    const familyDetail = await fetchFamilyDetail({ db, familyId })

    return NextResponse.json(familyDetail as GetFamilyDetailResponse)
  })
}
