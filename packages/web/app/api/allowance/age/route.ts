import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyAgeRewardTable } from "./query"
import { fetchUserInfoByUserId } from "../../users/query"
import { eq, and } from "drizzle-orm"
import { rewardByAges } from "@/drizzle/schema"
import { z } from "zod"

/** 家族の年齢別報酬テーブルを取得する */
export type GetFamilyAgeRewardTableResponse = {
  ageRewardTable: Awaited<ReturnType<typeof fetchFamilyAgeRewardTable>>
}
export async function GET(req: NextRequest) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    // 年齢別報酬テーブルを取得する
    const data = await fetchFamilyAgeRewardTable({ db, familyId: userInfo.profiles.familyId })

    return NextResponse.json({ ageRewardTable: data } as GetFamilyAgeRewardTableResponse)
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

    // 年齢別報酬テーブルを取得する
    const ageRewardTable = await fetchFamilyAgeRewardTable({ db, familyId: userInfo.profiles.familyId })

    // 報酬を更新する
    for (const reward of data.rewards) {
      await db
        .update(rewardByAges)
        .set({ amount: reward.amount })
        .where(
          and(
            eq(rewardByAges.type, "family"),
            eq(rewardByAges.ageRewardTableId, ageRewardTable.table.id),
            eq(rewardByAges.age, reward.age)
          )
        )
    }

    return NextResponse.json({})
  })
}
