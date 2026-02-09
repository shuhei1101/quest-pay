import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyProfile } from "./query"

/** 家族プロフィール情報を取得する */
export type GetFamilyProfileResponse = Awaited<ReturnType<typeof fetchFamilyProfile>>
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db } = await getAuthContext()
    // パスパラメータからIDを取得する
    const { id } = await context.params

    // 家族プロフィール情報を取得する
    const profile = await fetchFamilyProfile({
      db,
      familyId: id
    })

    return NextResponse.json(profile as GetFamilyProfileResponse)
  })
}
