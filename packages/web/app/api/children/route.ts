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
import { logger } from "@/app/(core)/logger"


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
    
    logger.info('子供一覧取得API開始', {
      path: req.nextUrl.pathname,
      userId,
    })
      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 子供を取得する
      logger.debug('子供データ取得実行', { familyId: userInfo.profiles.familyId })
      const result = await fetchChildrenByFamilyId({db, familyId: userInfo.profiles.familyId })
      
      logger.debug('子供一覧取得成功', { count: result.length })
  
      // 各子供のクエスト統計を並行で取得する
      const questStatsPromises = result
        .filter(child => child.children?.id)
        .map(async (child) => {
          const childId = child.children?.id
          if (!childId) return null
          return {
            id: childId,
            stats: await fetchChildQuestStats({db, childId})
          }
        })
      
      const questStatsArray = (await Promise.all(questStatsPromises)).filter((item): item is NonNullable<typeof item> => item !== null)
      const questStats: Record<string, Awaited<ReturnType<typeof fetchChildQuestStats>>> = {}
      for (const item of questStatsArray) {
        questStats[item.id] = item.stats
      }

      logger.debug('クエスト統計取得成功', { childCount: result.length, statsCount: Object.keys(questStats).length })
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
      
      logger.info('子供登録API開始', {
        path: request.nextUrl.pathname,
        userId,
      })
      
      // bodyから子供を取得する
      const body = await request.json()
      const data = PostChildRequestSchema.parse(body)
      
      logger.debug('子供登録データ検証成功', { name: data.form.name })

     // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({db})
        
      // 子供を登録する
      logger.debug('子供登録実行', { familyId: userInfo.profiles.familyId, inviteCode })
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
      
      logger.info('子供登録成功', { childId, name: data.form.name })
      return NextResponse.json({childId} as PostChildResponse)
    })
}
