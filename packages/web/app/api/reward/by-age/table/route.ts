import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { getOrCreateFamilyAgeRewardTable } from "./service"
import { fetchAgeRewards } from "../query"
import { updateFamilyAgeRewards } from "../service"
import { fetchUserInfoByUserId } from "../../../users/query"
import { z } from "zod"

/** 家族の年齢別報酬テーブルを取得する */
export type GetFamilyAgeRewardTableResponse = {
  ageRewardTable: {
    table: Awaited<ReturnType<typeof getOrCreateFamilyAgeRewardTable>>
    rewards: Awaited<ReturnType<typeof fetchAgeRewards>>
  }
}
export async function GET(req: NextRequest) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    // 年齢別報酬テーブルを取得または作成する
    const table = await getOrCreateFamilyAgeRewardTable({ db, familyId: userInfo.profiles.familyId })
    
    // 報酬データを取得する
    const rewards = await fetchAgeRewards({ db, ageRewardTableId: table.id })

    return NextResponse.json({ 
      ageRewardTable: {
        table,
        rewards
      }
    } as GetFamilyAgeRewardTableResponse)
  })
}

/** 家族の年齢別報酬テーブルを更新する */
export const PutFamilyAgeRewardTableRequestSchema = z.object({
  rewards: z.array(
    z.object({
      age: z.number().int().min(0).max(100),
      amount: z.number().int().min(0)
    })
  )
})
export type PutFamilyAgeRewardTableRequest = z.infer<typeof PutFamilyAgeRewardTableRequestSchema>
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
    const data = PutFamilyAgeRewardTableRequestSchema.parse(body)

    // 年齢別報酬テーブルを取得または作成する
    const table = await getOrCreateFamilyAgeRewardTable({ db, familyId: userInfo.profiles.familyId })

    // 報酬を更新する
    await updateFamilyAgeRewards({
      db,
      ageRewardTableId: table.id,
      rewards: data.rewards
    })

    return NextResponse.json({})
  })
}
