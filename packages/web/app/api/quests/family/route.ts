import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
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
    return withAuth(async (supabase, userId) => {
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
  })
}

/** クエストを登録する */
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // bodyからクエストを取得する
      const body = await request.json()
      const data  = PostFamilyQuestRequestScheme.parse(body)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
      // クエストを登録する
      const questId = await insertFamilyQuest({
        params: {
          _name: data.form.name,
          _family_id: userInfo.family_id,
          _is_public: data.form.isPublic,
          _type: "family",
          _icon_id: data.form.iconId,
          _icon_color: data.form.iconColor,
          _tags: [],
          _category_id: 0
        },
        supabase
      })

      return NextResponse.json({questId} as PostFamilyQuestResponse)
    })
  })
}
