import { NextResponse } from "next/server"
import { fetchFollowCount } from "../query"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { db } from "@/index"
import { AppError } from "@/app/(core)/error/appError"

/** フォロワー数とフォロー数を取得する */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: familyId } = await params

    // 親のみアクセス可能
    await authGuard({ childNG: true, guestNG: true })

    // フォロー数を取得する
    const counts = await fetchFollowCount({
      db,
      familyId,
    })

    return NextResponse.json(counts)
  } catch (error) {
    return AppError.toResponse(error)
  }
}
