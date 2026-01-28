import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { getOrCreateFamilyLevelRewardTable, updateFamilyLevelRewards } from "../service"
import { fetchUserInfoByUserId } from "../../../users/query"
import { z } from "zod"

/** 家族のレベル別報酬テーブルを取得する */
export type GetFamilyLevelRewardTableResponse = {
  levelRewardTable: Awaited<ReturnType<typeof getOrCreateFamilyLevelRewardTable>>
}
export async function GET(req: NextRequest) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    // レベル別報酬テーブルを取得する
    const data = await getOrCreateFamilyLevelRewardTable({ db, familyId: userInfo.profiles.familyId })

    return NextResponse.json({ levelRewardTable: data } as GetFamilyLevelRewardTableResponse)
  })
}

/** 家族のレベル別報酬テーブルを更新する */
export const PutFamilyLevelRewardTableRequestSchema = z.object({
  rewards: z.array(
    z.object({
      level: z.number().int().min(1).max(100),
      amount: z.number().int().min(0)
    })
  )
})
export type PutFamilyLevelRewardTableRequest = z.infer<typeof PutFamilyLevelRewardTableRequestSchema>
export async function PUT(req: NextRequest) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    if (userInfo.profiles.type !== "parent") throw new ServerError("親のみ更新可能です。")

    // リクエストボディを取得する
    const body = await req.json()
    const data = PutFamilyLevelRewardTableRequestSchema.parse(body)

    // レベル別報酬テーブルを取得する
    const levelRewardTable = await getOrCreateFamilyLevelRewardTable({ db, familyId: userInfo.profiles.familyId })

    // 報酬を更新する
    await updateFamilyLevelRewards({
      db,
      levelRewardTableId: levelRewardTable.table.id,
      rewards: data.rewards
    })

    return NextResponse.json({})
  })
}
