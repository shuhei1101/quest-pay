import { NextResponse } from "next/server"
import { fetchFamilyTimelines } from "../query"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { db } from "@/index"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyTimelinesResponse } from "../route"

/** 家族タイムラインを取得する */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: familyId } = await params

    // 親のみアクセス可能
    await authGuard({ childNG: true, guestNG: true })

    // 家族タイムラインを取得する
    const timelines = await fetchFamilyTimelines({
      db,
      familyId,
      limit: 50,
    })

    return NextResponse.json({ timelines } as GetFamilyTimelinesResponse)
  } catch (error) {
    return AppError.toResponse(error)
  }
}
