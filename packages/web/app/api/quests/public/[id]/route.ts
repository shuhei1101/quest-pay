import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchPublicQuest } from "../query"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { removePublicQuest, editPublicQuest } from "../service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { PublicQuestFormScheme } from "@/app/(app)/quests/public/[id]/form"
import { logger } from "@/app/(core)/logger"

/** 公開クエストを取得する */
export type GetPublicQuestResponse = {
  publicQuest: Awaited<ReturnType<typeof fetchPublicQuest>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエスト取得API開始', {
      path: '/api/quests/public/[id]',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const { id } = await context.params
    logger.debug('パスパラメータ取得完了', { publicQuestId: id })
    
    // 公開クエストを取得する
    const data = await fetchPublicQuest({ db, id: id })
    logger.debug('公開クエスト取得完了', { publicQuestId: id })

    logger.info('公開クエスト取得成功', { publicQuestId: id })

    return NextResponse.json({publicQuest: data} as GetPublicQuestResponse)
  })
}

/** 公開クエストを更新する */
export const PutPublicQuestRequestScheme = z.object({
  form: PublicQuestFormScheme,
  updatedAt: z.string(),
})
export type PutPublicQuestRequest = z.infer<typeof PutPublicQuestRequestScheme>
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエスト更新API開始', {
      path: '/api/quests/public/[id]',
      method: 'PUT',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const { id } = await context.params

    // bodyから公開クエストを取得する
    const body = await req.json()
    const data = PutPublicQuestRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { publicQuestId: id })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 現在の公開クエストを取得する
    const currentPublicQuest = await fetchPublicQuest({ db, id: id })

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== currentPublicQuest?.familyQuest?.familyId) {
      logger.warn('異なる家族の公開クエスト更新試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: currentPublicQuest?.familyQuest?.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }
        
      // 公開クエストを更新する
      await editPublicQuest({
        db,
        publicQuest: {
          id,
          record: {},
          updatedAt: data.updatedAt,
        },
        questDetails: data.form.details.map((detail) => ({
          level: detail.level,
          successCondition: detail.successCondition,
          requiredCompletionCount: detail.requiredCompletionCount,
          reward: detail.reward,
          childExp: detail.childExp,
          requiredClearCount: detail.requiredClearCount,
        })),
        quest: {
          id: currentPublicQuest.quest.id,
          record: {
            iconColor: data.form.iconColor,
            name: data.form.name,
            iconId: data.form.iconId,
            ageFrom: data.form.ageFrom,
            ageTo: data.form.ageTo,
            categoryId: data.form.categoryId,
            monthFrom: data.form.monthFrom,
            monthTo: data.form.monthTo,
            requestDetail: data.form.requestDetail,
            client: data.form.client,
          },
          updatedAt: data.updatedAt,
        },
        questTags: data.form.tags.map((tagName) => ({
          name: tagName,
        }))
      })
      
      return NextResponse.json({})
    })
}

/** 公開クエストを削除する */
export const DeletePublicQuestRequestScheme = z.object({
  updatedAt: z.string()
})
export type DeletePublicQuestRequest = z.infer<typeof DeletePublicQuestRequestScheme>
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエスト削除API開始', {
      path: '/api/quests/public/[id]',
      method: 'DELETE',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const {id} = await context.params

    // bodyから公開クエストを取得する
    const body = await req.json()
    const data = DeletePublicQuestRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { publicQuestId: id })

    // 公開クエストを削除する
    await removePublicQuest({
      db,
      publicQuest: {
        id,
        updatedAt: data.updatedAt,
      },
      quest: {
        updatedAt: data.updatedAt,
      }
    })
    logger.debug('公開クエスト削除完了', { publicQuestId: id })

    logger.info('公開クエスト削除成功', { publicQuestId: id })

    return NextResponse.json({})
  })
}
