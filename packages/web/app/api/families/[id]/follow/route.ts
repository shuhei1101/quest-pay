import { NextResponse } from "next/server"
import { insertFollow, deleteFollow } from "./db"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { db } from "@/index"
import { AppError, ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByUserId } from "@/app/api/users/query"

/** フォローを追加する */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: followFamilyId } = await context.params

    // 認証コンテキストを取得する
    const { userId } = await getAuthContext()
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo?.profiles?.type !== "parent") throw new ServerError("親のみアクセス可能です。")

    const followerFamilyId = userInfo.profiles.familyId

    // 自分自身をフォローできないようにする
    if (followerFamilyId === followFamilyId) {
      throw new AppError("INVALID_OPERATION", 400, "自分自身をフォローすることはできません。")
    }

    // フォローを追加する
    await insertFollow({
      db,
      followerFamilyId,
      followFamilyId,
    })

    return NextResponse.json({ success: true })
  })
}

/** フォローを解除する */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    const { id: followFamilyId } = await context.params

    // 認証コンテキストを取得する
    const { userId } = await getAuthContext()
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo?.profiles?.type !== "parent") throw new ServerError("親のみアクセス可能です。")

    const followerFamilyId = userInfo.profiles.familyId

    // フォローを解除する
    await deleteFollow({
      db,
      followerFamilyId,
      followFamilyId,
    })

    return NextResponse.json({ success: true })
  })
}
