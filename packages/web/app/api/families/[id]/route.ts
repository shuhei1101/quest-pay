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
    const familyData = await fetchFamily({ db, familyId })
    if (!familyData?.families) {
      throw new AppError("NOT_FOUND", 404, "家族が見つかりません。")
    }

    // 統計情報を取得する
    const stats = await fetchFamilyStats({ db, familyId })

    // フォロー数を取得する
    const followCount = await fetchFollowCount({ db, familyId })

    return NextResponse.json({
      family: {
        id: familyData.families.id,
        displayId: familyData.families.displayId,
        localName: familyData.families.localName,
        onlineName: familyData.families.onlineName,
        introduction: familyData.families.introduction,
        iconId: familyData.families.iconId,
        iconColor: familyData.families.iconColor,
      },
      icon: familyData.icons ? {
        name: familyData.icons.name,
        size: familyData.icons.size,
      } : null,
      stats,
      followCount,
    })
  })
}
