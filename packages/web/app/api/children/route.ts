import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { registerChild } from "./service"
import { generateUniqueInviteCode } from "./invite/service"
import { fetchUserInfoByUserId } from "../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchChildrenByFamilyId, fetchChildQuestStats } from "./query"
import { ChildFormSchema, ChildFormType } from "@/app/(app)/children/[id]/form"
import z from "zod"


/** 家族の子供を取得する */
export type GetChildrenResponse = {
  children: Awaited<ReturnType<typeof fetchChildrenByFamilyId>>
  questStats: Record<string, Awaited<ReturnType<typeof fetchChildQuestStats>>>
}
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 子供を取得する
      const result = await fetchChildrenByFamilyId({db, familyId: userInfo.profiles.familyId })
  
      // 各子供のクエスト統計を並行で取得する
      const questStatsPromises = result
        .filter(child => child.children?.id)
        .map(async (child) => ({
          id: child.children!.id,
          stats: await fetchChildQuestStats({db, childId: child.children!.id})
        }))
      
      const questStatsArray = await Promise.all(questStatsPromises)
      const questStats: Record<string, Awaited<ReturnType<typeof fetchChildQuestStats>>> = {}
      for (const item of questStatsArray) {
        questStats[item.id] = item.stats
      }

      return NextResponse.json({children: result, questStats} as GetChildrenResponse)
    })
}

/** 子供を登録する */
export const PostChildRequestSchema = z.object({
  form: ChildFormSchema
})
export type PostChildRequest = z.infer<typeof PostChildRequestSchema>
export type PostChildResponse = {
  childId: Awaited<ReturnType<typeof registerChild>>
}
export async function POST(
  request: NextRequest,
) {
  // 認証コンテキストを取得する
  return withRouteErrorHandling(async () => {
      const { db, userId } = await getAuthContext()
      // bodyから子供を取得する
      const body = await request.json()
      const data = PostChildRequestSchema.parse(body)

     // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({db})
        
      // 子供を登録する
      const childId = await registerChild({
        child: {
          inviteCode: inviteCode
        },
        profile: {
          name: data.form.name,
          iconColor: data.form.iconColor,
          iconId: data.form.iconId,
          familyId: userInfo.profiles.familyId
        }
      })
      return NextResponse.json({childId} as PostChildResponse)
    })
}
