import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchFamilyQuest } from "../query"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { removeFamilyQuest, editFamilyQuest } from "../service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { FamilyQuestFormScheme } from "@/app/(app)/quests/family/[id]/form"
import { logger } from "@/app/(core)/logger"

/** 家族クエストを取得する */
export type GetFamilyQuestResponse = {
  familyQuest: Awaited<ReturnType<typeof fetchFamilyQuest>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族クエスト取得API開始', {
      path: '/api/quests/family/[id]',
      method: 'GET',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const params = await context.params
    logger.debug('パスパラメータ取得完了', { familyQuestId: params.id })
    
    // 家族クエストを取得する
    const data = await fetchFamilyQuest({ db, id: params.id })
    logger.debug('家族クエスト取得完了', { familyQuestId: params.id })

    logger.info('家族クエスト取得成功', { familyQuestId: params.id })

    return NextResponse.json({familyQuest: data} as GetFamilyQuestResponse)
  })
}

/** 家族クエストを更新する */
export const PutFamilyQuestRequestScheme = z.object({
  form: FamilyQuestFormScheme,
  familyQuestUpdatedAt: z.string(),
  questUpdatedAt: z.string(),
})
export type PutFamilyQuestRequest = z.infer<typeof PutFamilyQuestRequestScheme>
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族クエスト更新API開始', {
      path: '/api/quests/family/[id]',
      method: 'PUT',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const params = await context.params

    // bodyから家族クエストを取得する
    const body = await req.json()
    const data = PutFamilyQuestRequestScheme.parse(body)
    logger.debug('リクエストボディ検証完了', { familyQuestId: params.id })

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 現在の家族クエストを取得する
    const currentFamilyQuest = await fetchFamilyQuest({ db, id: params.id })

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== currentFamilyQuest?.base.familyId) {
      logger.warn('異なる家族のクエスト更新試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: currentFamilyQuest?.base.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }
        
      // 家族クエストを更新する
      await editFamilyQuest({
        db,
        familyQuest: {
          id: params.id,
          record: {
            familyId: userInfo.profiles.familyId,
          },
          updatedAt: data.familyQuestUpdatedAt,
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
          id: currentFamilyQuest.quest.id,
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
          updatedAt: data.questUpdatedAt,
        },
        questChildren: data.form.childSettings
          .filter(setting => setting.isActivate || setting.hasQuestChildren) // isActivateがtrueまたはhasQuestChildrenがtrueのもの
          .map((setting) => ({
            childId: setting.childId,
            isActivate: setting.isActivate,
          })),
        questTags: data.form.tags.map((tagName) => ({
          name: tagName,
        }))
      })
      
      return NextResponse.json({})
    })
}

/** 家族クエストを削除する */
export const DeleteFamilyQuestRequestScheme = z.object({
  updatedAt: z.string()
})
export type DeleteFamilyQuestRequest = z.infer<typeof DeleteFamilyQuestRequestScheme>
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params

      // bodyから家族クエストを取得する
      const body = await req.json()
      const data = DeleteFamilyQuestRequestScheme.parse(body)

      // 家族クエストを削除する
      await removeFamilyQuest({
        db,
        familyQuest: {
          id: params.id,
          updatedAt: data.updatedAt,
        },
        quest: {
          updatedAt: data.updatedAt,
        }
      })

      return NextResponse.json({})
    })
}
