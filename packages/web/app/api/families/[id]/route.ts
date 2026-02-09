import { NextResponse } from "next/server"
import { fetchFamily, fetchFamilyStats } from "../query"
import { fetchFollowCount } from "./follow/query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { AppError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 家族詳細情報を取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: familyId } = await context.params

    // 認証コンテキストを取得する（認証は必要だが、親チェックは不要）
    await getAuthContext()

    // 家族情報を取得する
    const family = await fetchFamily({ db, familyId })
    if (!family) {
      throw new AppError("NOT_FOUND", 404, "家族が見つかりません。")
    }

    // 統計情報を取得する
    const stats = await fetchFamilyStats({ db, familyId })

    // フォロー数を取得する
    const followCount = await fetchFollowCount({ db, familyId })

    return NextResponse.json({
      family: {
        id: family.id,
        displayId: family.displayId,
        onlineName: family.onlineName,
        introduction: family.introduction,
        iconId: family.iconId,
        iconColor: family.iconColor,
      },
      stats,
      followCount,
    })
  })
}
