import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { getOrCreateChildAgeRewardTable } from "./service"
import { fetchAgeRewards } from "@/app/api/reward/by-age/query"
import { updateAgeRewards } from "./service"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { z } from "zod"
import { logger } from "@/app/(core)/logger"

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
    logger.info('子供別年齢報酬テーブル取得API開始', {
      path: '/api/children/[id]/reward/by-age/table',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // パラメータを取得する
    const { id: childId } = await context.params
    logger.debug('認証コンテキスト取得完了', { userId, childId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (userInfo?.profiles?.type !== "parent") {
      logger.warn('親以外のアクセス検出', {
        userId,
        profileType: userInfo?.profiles?.type,
      })
      throw new ServerError("親のみアクセス可能です。")
    }
    logger.debug('プロフィール情報取得完了', { profileType: userInfo.profiles.type })

    // 年齢別報酬テーブルを取得または作成する
    const table = await getOrCreateChildAgeRewardTable({ db, childId })
    logger.debug('年齢別報酬テーブル取得完了', { tableId: table.id })
    
    // 報酬データを取得する
    const rewards = await fetchAgeRewards({ db, ageRewardTableId: table.id, type: "child" })
    logger.debug('年齢別報酬データ取得完了', { rewardsCount: rewards.length })

    logger.info('子供別年齢報酬テーブル取得成功', {
      childId,
      tableId: table.id,
      rewardsCount: rewards.length,
    })

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
