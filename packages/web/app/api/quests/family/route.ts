import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { fetchFamilyQuests } from "./query"
import queryString from "query-string"
import { registerFamilyQuest } from "./service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { FamilyQuestFormScheme, FamilyQuestFormType } from "@/app/(app)/quests/parent/[id]/form"
import z from "zod"
import { QuestColumnSchema } from "@/drizzle/schema"
import { SortOrderScheme } from "@/app/(core)/schema"
import { FamilyQuestFilterScheme } from "./schema"

/** 家族クエスト検索パラメータ */
export const FamilyQuestSearchParamsScheme = FamilyQuestFilterScheme.extend({
  sortColumn: QuestColumnSchema,
  sortOrder: SortOrderScheme,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type FamilyQuestSearchParams = z.infer<typeof FamilyQuestSearchParamsScheme>


/** 家族のクエストを取得する */
export type GetFamilyQuestsResponse = Awaited<ReturnType<typeof fetchFamilyQuests>>
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // クエリパラメータを取得する
      const url = new URL(req.url)
      const query = queryString.parse(url.search)
      const params = FamilyQuestSearchParamsScheme.parse(query)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.family.id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // クエストを取得する
      const result = await fetchFamilyQuests({db, familyId: userInfo.family.id, params })
  
      return NextResponse.json(result as GetFamilyQuestsResponse)
  })
}

/** クエストを登録する */
export const PostFamilyQuestRequestScheme = z.object({
  form: FamilyQuestFormScheme
})
export type PostFamilyQuestRequest = z.infer<typeof PostFamilyQuestRequestScheme>
export type PostFamilyQuestResponse = {
  questId: Awaited<ReturnType<typeof registerFamilyQuest>>
}
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // bodyからクエストを取得する
      const body = await request.json()
      const data  = PostFamilyQuestRequestScheme.parse(body)

      // ユーザ情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.family.id) throw new ServerError("家族IDの取得に失敗しました。")
      if (userInfo.type !== "parent") throw new ServerError("親ユーザのみクエストの作成が可能です。")
        
      // クエストを登録する
      const questId = await registerFamilyQuest({
        db,
        quests: {
          iconColor: data.form.iconColor,
          name: data.form.name,
          iconId: data.form.iconId,
          ageFrom: data.form.ageFrom,
          ageTo: data.form.ageTo,
          categoryId: data.form.categoryId,
          client: data.form.client,
          monthFrom: data.form.monthFrom,
          monthTo: data.form.monthTo,
          requestDetail: data.form.requestDetail,
        },
        questDetails: data.form.details.map((detail) => ({
          level: detail.level,
          successCondition: detail.successCondition,
          requiredCompletionCount: detail.requiredCompletionCount,
          reward: detail.reward,
          childExp: detail.childExp,
          requiredClearCount: detail.requiredClearCount,
        })),
        familyQuest: {
          familyId: userInfo.family.id,
          isPublic: data.form.isPublic,
          isClientPublic: data.form.isClientPublic,
          isRequestDetailPublic: data.form.isRequestDetailPublic,
        },
        questChildren: data.form.childIds.map((childId) => ({
          childId: childId,
        })),
        questTags: data.form.tags.map((tagName) => ({
          name: tagName,
        }))
      })

      return NextResponse.json({questId} as PostFamilyQuestResponse)
    })
}
