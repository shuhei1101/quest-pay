import { NextResponse } from "next/server"
import { insertFollow, deleteFollow } from "./db"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { db } from "@/index"
import { AppError } from "@/app/(core)/error/appError"

/** フォローを追加する */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: followFamilyId } = await params

    // 親のみアクセス可能
    const { familyId: followerFamilyId } = await authGuard({ childNG: true, guestNG: true })

    // 自分自身をフォローできないようにする
    if (followerFamilyId === followFamilyId) {
      throw new AppError("自分自身をフォローすることはできません。", 400)
    }

    // フォローを追加する
    await insertFollow({
      db,
      followerFamilyId,
      followFamilyId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return AppError.toResponse(error)
  }
}

/** フォローを解除する */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: followFamilyId } = await params

    // 親のみアクセス可能
    const { familyId: followerFamilyId } = await authGuard({ childNG: true, guestNG: true })

    // フォローを解除する
    await deleteFollow({
      db,
      followerFamilyId,
      followFamilyId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return AppError.toResponse(error)
  }
}
