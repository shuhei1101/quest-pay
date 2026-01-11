import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchTemplateQuest } from "../query"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { removeTemplateQuest, editTemplateQuest } from "../service"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import z from "zod"
import { TemplateQuestFormScheme } from "@/app/(app)/quests/template/[id]/form"

/** テンプレートクエストを取得する */
export type GetTemplateQuestResponse = {
  templateQuest: Awaited<ReturnType<typeof fetchTemplateQuest>>
}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params
      
      devLog("GetTemplateQuest.パラメータ.ID: ", id)
      
      // テンプレートクエストを取得する
      const data = await fetchTemplateQuest({ db, id: id })
      
      devLog("取得したテンプレートクエスト: ", data)
  
      return NextResponse.json({templateQuest: data} as GetTemplateQuestResponse)
    })
}

/** テンプレートクエストを更新する */
export const PutTemplateQuestRequestScheme = z.object({
  form: TemplateQuestFormScheme,
  updatedAt: z.string(),
})
export type PutTemplateQuestRequest = z.infer<typeof PutTemplateQuestRequestScheme>
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const { id } = await context.params

      // bodyからテンプレートクエストを取得する
      const body = await req.json()
      const data = PutTemplateQuestRequestScheme.parse(body)

      // プロフィール情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")

      // 現在のテンプレートクエストを取得する
      const currentTemplateQuest = await fetchTemplateQuest({ db, id: id })

      // 家族IDが一致しない場合
      if (userInfo.profiles.familyId !== currentTemplateQuest?.family?.id) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
        
      // テンプレートクエストを更新する
      await editTemplateQuest({
        db,
        templateQuest: {
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
          id: currentTemplateQuest.quest.id,
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

/** テンプレートクエストを削除する */
export const DeleteTemplateQuestRequestScheme = z.object({
  updatedAt: z.string()
})
export type DeleteTemplateQuestRequest = z.infer<typeof DeleteTemplateQuestRequestScheme>
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const {id} = await context.params

      // bodyからテンプレートクエストを取得する
      const body = await req.json()
      const data = DeleteTemplateQuestRequestScheme.parse(body)

      // テンプレートクエストを削除する
      await removeTemplateQuest({
        db,
        templateQuest: {
          id,
          updatedAt: data.updatedAt,
        },
        quest: {
          updatedAt: data.updatedAt,
        }
      })

      return NextResponse.json({})
    })
}
