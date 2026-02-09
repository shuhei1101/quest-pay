import { NextResponse } from "next/server"
import { fetchFollowStatus } from "../query"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { db } from "@/index"
import { AppError } from "@/app/(core)/error/appError"

/** フォロー状態を取得する */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: followFamilyId } = await params

    // 親のみアクセス可能
    const { familyId: followerFamilyId } = await authGuard({ childNG: true, guestNG: true })

    // フォロー状態を取得する
    const isFollowing = await fetchFollowStatus({
      db,
      followerFamilyId,
      followFamilyId,
    })

    return NextResponse.json({ isFollowing })
  } catch (error) {
    return AppError.toResponse(error)
  }
}
