import { NextResponse } from "next/server"
import { fetchFamily, fetchFamilyStats } from "../query"
import { fetchFollowCount } from "./follow/query"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { db } from "@/index"
import { AppError } from "@/app/(core)/error/appError"

/** 家族詳細情報を取得する */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: familyId } = await params

    // 親のみアクセス可能
    await authGuard({ childNG: true, guestNG: true })

    // 家族情報を取得する
    const family = await fetchFamily({ db, familyId })
    if (!family) {
      throw new AppError("家族が見つかりません。", 404)
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
  } catch (error) {
    return AppError.toResponse(error)
  }
}
