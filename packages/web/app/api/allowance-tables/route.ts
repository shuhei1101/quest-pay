import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchAllowanceTableByFamilyId, fetchLevelTableByFamilyId } from "./query"
import { fetchUserInfoByUserId } from "../users/query"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { 
  familyAllowanceTables, 
  familyAllowanceByAges, 
  familyLevelTables, 
  familyLevelRewards 
} from "@/drizzle/schema"

/** 家族のお小遣いテーブルとレベルテーブルを取得する */
export type GetAllowanceTablesResponse = {
  allowanceTable: Awaited<ReturnType<typeof fetchAllowanceTableByFamilyId>>
  levelTable: Awaited<ReturnType<typeof fetchLevelTableByFamilyId>>
}

export async function GET(req: NextRequest) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    // お小遣いテーブルを取得する
    const allowanceTable = await fetchAllowanceTableByFamilyId({ db, familyId: userInfo.profiles.familyId })

    // レベルテーブルを取得する
    const levelTable = await fetchLevelTableByFamilyId({ db, familyId: userInfo.profiles.familyId })

    return NextResponse.json({ allowanceTable, levelTable } as GetAllowanceTablesResponse)
  })
}

/** お小遣いテーブル更新リクエスト */
export const PutAllowanceTablesRequestSchema = z.object({
  allowanceByAges: z.array(z.object({
    age: z.number(),
    amount: z.number()
  })),
  levelRewards: z.array(z.object({
    level: z.number(),
    amount: z.number()
  }))
})
export type PutAllowanceTablesRequest = z.infer<typeof PutAllowanceTablesRequestSchema>
export type PutAllowanceTablesResponse = {
  success: boolean
}

export async function PUT(request: NextRequest) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()

    // bodyからデータを取得する
    const body = await request.json()
    const data = PutAllowanceTablesRequestSchema.parse(body)

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

    const familyId = userInfo.profiles.familyId

    // トランザクションで更新する
    await db.transaction(async (tx) => {
      // お小遣いテーブルの取得または作成
      let allowanceTableData = await tx
        .select()
        .from(familyAllowanceTables)
        .where(eq(familyAllowanceTables.familyId, familyId))
        .limit(1)

      let allowanceTableId: string

      if (allowanceTableData.length === 0) {
        // テーブルが存在しない場合は作成する
        const inserted = await tx
          .insert(familyAllowanceTables)
          .values({ familyId })
          .returning()
        allowanceTableId = inserted[0].id
      } else {
        allowanceTableId = allowanceTableData[0].id
      }

      // 既存の年齢別お小遣い額を削除する
      await tx
        .delete(familyAllowanceByAges)
        .where(eq(familyAllowanceByAges.allowanceTableId, allowanceTableId))

      // 新しい年齢別お小遣い額を挿入する
      if (data.allowanceByAges.length > 0) {
        await tx.insert(familyAllowanceByAges).values(
          data.allowanceByAges.map(item => ({
            allowanceTableId,
            age: item.age,
            amount: item.amount
          }))
        )
      }

      // レベルテーブルの取得または作成
      let levelTableData = await tx
        .select()
        .from(familyLevelTables)
        .where(eq(familyLevelTables.familyId, familyId))
        .limit(1)

      let levelTableId: string

      if (levelTableData.length === 0) {
        // テーブルが存在しない場合は作成する
        const inserted = await tx
          .insert(familyLevelTables)
          .values({ familyId })
          .returning()
        levelTableId = inserted[0].id
      } else {
        levelTableId = levelTableData[0].id
      }

      // 既存のレベル別報酬額を削除する
      await tx
        .delete(familyLevelRewards)
        .where(eq(familyLevelRewards.levelTableId, levelTableId))

      // 新しいレベル別報酬額を挿入する
      if (data.levelRewards.length > 0) {
        await tx.insert(familyLevelRewards).values(
          data.levelRewards.map(item => ({
            levelTableId,
            level: item.level,
            amount: item.amount
          }))
        )
      }
    })

    return NextResponse.json({ success: true } as PutAllowanceTablesResponse)
  })
}
