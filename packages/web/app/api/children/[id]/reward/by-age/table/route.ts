import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { getOrCreateChildAgeRewardTable } from "./service"
import { fetchAgeRewards } from "@/app/api/reward/by-age/query"
import { updateAgeRewards } from "./service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { z } from "zod"

type Context = {
  params: Promise<{ id: string }>
}

/** 子供の年齢別報酬テーブルを取得する */
export type GetChildAgeRewardTableResponse = {
  ageRewardTable: {
    table: Awaited<ReturnType<typeof getOrCreateChildAgeRewardTable>>
    rewards: Awaited<ReturnType<typeof fetchAgeRewards>>
  }
}
export async function GET(req: NextRequest, context: Context) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // パラメータを取得する
    const { id: childId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (userInfo?.profiles?.type !== "parent") throw new ServerError("親のみアクセス可能です。")

    // 年齢別報酬テーブルを取得または作成する
    const table = await getOrCreateChildAgeRewardTable({ db, childId })
    
    // 報酬データを取得する
    const rewards = await fetchAgeRewards({ db, ageRewardTableId: table.id, type: "child" })

    return NextResponse.json({ 
      ageRewardTable: {
        table,
        rewards
      }
    } as GetChildAgeRewardTableResponse)
  })
}

/** 子供の年齢別報酬テーブルを更新する */
export const PutChildAgeRewardTableRequestSchema = z.object({
  rewards: z.array(
    z.object({
      age: z.number().int().min(0).max(100),
      amount: z.number().int().min(0)
    })
  )
})
export type PutChildAgeRewardTableRequest = z.infer<typeof PutChildAgeRewardTableRequestSchema>
export async function PUT(req: NextRequest, context: Context) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // パラメータを取得する
    const { id: childId } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (userInfo?.profiles?.type !== "parent") throw new ServerError("親のみ更新可能です。")

    // リクエストボディを取得する
    const body = await req.json()
    const data = PutChildAgeRewardTableRequestSchema.parse(body)

    // 年齢別報酬テーブルを取得または作成する
    const table = await getOrCreateChildAgeRewardTable({ db, childId })

    // 報酬を更新する
    await updateAgeRewards({
      db,
      ageRewardTableId: table.id,
      rewards: data.rewards,
      type: "child"
    })

    return NextResponse.json({})
  })
}
