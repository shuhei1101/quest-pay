import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { fetchFamilyQuests } from "./query"
import queryString from "query-string"
import { FamilyQuestSearchParamsScheme, GetFamilyQuestsResponse, PostFamilyQuestRequestScheme, PostFamilyQuestResponse } from "./scheme"
import { insertFamilyQuest } from "./db"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 家族のクエストを取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { supabase, userId } = await getAuthContext()
      // クエリパラメータを取得する
      const url = new URL(req.url)
      const query = queryString.parse(url.search)
      const params = FamilyQuestSearchParamsScheme.parse(query)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // クエストを取得する
      const result = await fetchFamilyQuests({supabase, familyId: userInfo.family_id, params })
  
      return NextResponse.json(result as GetFamilyQuestsResponse)
    })

}

/** クエストを登録する */
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { supabase, userId } = await getAuthContext()
      // bodyからクエストを取得する
      const body = await request.json()
      const data  = PostFamilyQuestRequestScheme.parse(body)

      // ユーザ情報を取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
      if (userInfo.user_type !== "parent") throw new ServerError("親ユーザのみクエストの作成が可能です。")
        
      // クエストを登録する
      const questId = await insertFamilyQuest({
        params: {
          _name: data.form.name,
          _is_public: data.form.isPublic,
          _type: "family",
          _icon_id: data.form.iconId,
          _icon_color: data.form.iconColor,
          _tags: data.form.tags,
          _category_id: data.form.categoryId,
          _details: data.form.details.map(detail => ({
            level: detail.level,
            success_condition: detail.successCondition,
            required_completion_count: detail.requiredCompletionCount,
            reward: detail.reward,
            child_exp: detail.childExp,
            required_clear_count: detail.requiredClearCount,
          })),
          _child_ids: data.form.childIds,
        },
        supabase
      })

      return NextResponse.json({questId} as PostFamilyQuestResponse)
    })
}
