import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { getOrCreateChildLevelRewardTable } from "./service"
import { fetchLevelRewards } from "@/app/api/reward/by-level/query"
import { updateLevelRewards } from "./service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { z } from "zod"

type Context = {
  params: Promise<{ id: string }>
}

/** 子供のレベル別報酬テーブルを取得する */
export type GetChildLevelRewardTableResponse = {
  levelRewardTable: {
    table: Awaited<ReturnType<typeof getOrCreateChildLevelRewardTable>>
    rewards: Awaited<ReturnType<typeof fetchLevelRewards>>
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

    // レベル別報酬テーブルを取得または作成する
    const table = await getOrCreateChildLevelRewardTable({ db, childId })
    
    // 報酬データを取得する
    const rewards = await fetchLevelRewards({ db, levelRewardTableId: table.id, type: "child" })

    return NextResponse.json({ 
      levelRewardTable: {
        table,
        rewards
      }
    } as GetChildLevelRewardTableResponse)
  })
}

/** 子供のレベル別報酬テーブルを更新する */
export const PutChildLevelRewardTableRequestSchema = z.object({
  rewards: z.array(
    z.object({
      level: z.number().int().min(1).max(12),
      amount: z.number().int().min(0)
    })
  )
})
export type PutChildLevelRewardTableRequest = z.infer<typeof PutChildLevelRewardTableRequestSchema>
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
    const data = PutChildLevelRewardTableRequestSchema.parse(body)

    // レベル別報酬テーブルを取得または作成する
    const table = await getOrCreateChildLevelRewardTable({ db, childId })

    // 報酬を更新する
    await updateLevelRewards({
      db,
      levelRewardTableId: table.id,
      rewards: data.rewards,
      type: "child"
    })

    return NextResponse.json({})
  })
}
