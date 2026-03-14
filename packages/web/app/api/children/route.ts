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
    logger.info('子供一覧取得API開始', {
      path: req.nextUrl.pathname,
      method: req.method,
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('家族ID取得完了', { familyId: userInfo.profiles.familyId })
    
    // 子供を取得する
    const result = await fetchChildrenByFamilyId({db, familyId: userInfo.profiles.familyId })
    logger.debug('子供取得完了', { 
      familyId: userInfo.profiles.familyId,
      childrenCount: result.length,
    })
    
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
    logger.debug('クエスト統計取得完了', { 
      statsCount: questStatsArray.length,
    })
    
    logger.info('子供一覧取得API完了', {
      childrenCount: result.length,
      statsCount: questStatsArray.length,
    })
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
  return withRouteErrorHandling(async () => {
    logger.info('子供登録API開始', {
      path: request.nextUrl.pathname,
      method: request.method,
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // bodyから子供を取得する
    const body = await request.json()
    const data = PostChildRequestSchema.parse(body)
    logger.debug('リクエストバリデーション完了', {
      childName: data.form.name,
    })
      

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('家族ID取得完了', { familyId: userInfo.profiles.familyId })
    
    // 招待コードを生成する
    const inviteCode = await generateUniqueInviteCode({db})
    logger.debug('招待コード生成完了', { inviteCode })
        
    // 子供を登録する
    logger.info('子供登録処理開始', {
      userId,
      familyId: userInfo.profiles.familyId,
      childName: data.form.name,
    })
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
    
    logger.info('子供登録処理完了', {
      userId,
      familyId: userInfo.profiles.familyId,
      childId,
    })
    return NextResponse.json({childId} as PostChildResponse)
    })
}
