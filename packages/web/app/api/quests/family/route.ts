import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfo } from "@/app/api/users/login/query"
import { ServerError } from "@/app/(core)/error/appError"
import { fetchFamilyQuests } from "./query"
import queryString from "query-string"
import { FamilyQuestSearchParamsSchema, GetFamilyQuestsResponse, PostFamilyQuestRequestSchema, PostFamilyQuestResponse } from "./schema"
import { insertFamilyQuest } from "./db"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 家族のクエストを取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      const url = new URL(req.url)
      const query = queryString.parse(url.search)
      const params = FamilyQuestSearchParamsSchema.parse(query)

      // 家族IDを取得する
      const userInfo = await fetchUserInfo({userId, supabase})
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
  return withAuth(async (supabase, userId) => {
    return withRouteErrorHandling(async () => {
      // bodyからクエストを取得する
      const body = await request.json()
      const data  = PostFamilyQuestRequestSchema.parse(body)

      // 家族IDを取得する
      const userInfo = await fetchUserInfo({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
      // クエストを登録する
      const questId = await insertFamilyQuest({
        quest: {
          name: data.quest.name,
          icon_id: data.quest.icon_id,
          type: "family",
          category_id: data.quest.category_id,
          icon_color: data.quest.icon_color
        },
        familyQuest: {
          family_id: userInfo.family_id,
          is_public: data.familyQuest.is_public
        },
        tags: data.tags,
        supabase
      })

      return NextResponse.json({questId} as PostFamilyQuestResponse)
    })
  })
}
