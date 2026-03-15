import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { getOrCreateFamilyLevelRewardTable } from "./service"
import { fetchLevelRewards } from "../query"
import { updateFamilyLevelRewards } from "../service"
import { fetchUserInfoByUserId } from "../../../users/query"
import { z } from "zod"
import { logger } from "@/app/(core)/logger"

/** 家族のレベル別報酬テーブルを取得する */
export type GetFamilyLevelRewardTableResponse = {
  levelRewardTable: {
    table: Awaited<ReturnType<typeof getOrCreateFamilyLevelRewardTable>>
    rewards: Awaited<ReturnType<typeof fetchLevelRewards>>
  }
}
export async function GET(req: NextRequest) {
  return withRouteErrorHandling(async () => {
    logger.info('レベル別報酬テーブル取得API開始', {
      path: '/api/reward/by-level/table',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // レベル別報酬テーブルを取得または作成する
    const table = await getOrCreateFamilyLevelRewardTable({ db, familyId: userInfo.profiles.familyId })
    logger.debug('レベル別報酬テーブル取得完了', { tableId: table.id })
    
    // 報酬データを取得する
    const rewards = await fetchLevelRewards({ db, levelRewardTableId: table.id })
    logger.debug('レベル別報酬データ取得完了', { rewardsCount: rewards.length })

    logger.info('レベル別報酬テーブル取得成功', {
      tableId: table.id,
      rewardsCount: rewards.length,
    })

    return NextResponse.json({ 
      levelRewardTable: {
        table,
        rewards
      }
    } as GetFamilyLevelRewardTableResponse)
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

    // レベル別報酬テーブルを取得または作成する
    const table = await getOrCreateFamilyLevelRewardTable({ db, familyId: userInfo.profiles.familyId })

    // 報酬を更新する
    await updateFamilyLevelRewards({
      db,
      levelRewardTableId: table.id,
      rewards: data.rewards
    })

    return NextResponse.json({})
  })
}
