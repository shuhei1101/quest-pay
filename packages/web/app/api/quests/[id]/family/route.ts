import { NextRequest, NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { withAuth } from "@/app/(core)/withAuth"
import { fetchFamilyQuest } from "../../family/query"
import { DeleteFamilyQuestRequestSchema, GetFamilyQuestResponse, PutFamilyQuestRequestSchema } from "./schema"
import { fetchUserInfo } from "@/app/api/users/login/query"
import { ServerError } from "@/app/(core)/appError"
import { deleteFamilyQuest, updateFamilyQuest } from "../../family/db"
import { devLog } from "@/app/(core)/util"

/** 家族クエストを取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(async (supabase) => {
    try {
      // パスパラメータからIDを取得する
      const params = await context.params
      const questId = Number(params.id)
      
      devLog("GetFamilyQuest.パラメータ.ID: ", params.id)
      
      // 家族クエストを取得する
      const data = await fetchFamilyQuest({ supabase, questId })
      
      devLog("取得した家族クエスト: ", data)
  
      return NextResponse.json({quest: data} as GetFamilyQuestResponse)
    } catch (err) {
      return handleServerError(err)
    }
  })
}

/** 家族クエストを更新する */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(async (supabase, userId) => {
    try {
      // パスパラメータからIDを取得する
      const params = await context.params
      const questId = Number(params.id)

      // bodyから家族クエストを取得する
      const body = await req.json()
      const data = PutFamilyQuestRequestSchema.parse(body)

      // 家族IDを取得する
      const userInfo = await fetchUserInfo({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 家族クエストを更新する
      await updateFamilyQuest({
        tags: data.tags,
        quest: {
          icon_id: data.quest.icon_id,
          type: "family",
          name: data.quest.name,
          id: questId,
          updated_at: data.quest.updated_at,
          category_id: data.quest.category_id,
          icon_color: data.quest.icon_color,
        },
        supabase,
        familyQuest: {
          family_id: userInfo.family_id,
          is_public: data.family_quest.is_public
        }
      })
      
      return NextResponse.json({})
    } catch (err) {
      return handleServerError(err)
    }
  })
}

/** 家族クエストを削除する */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(async (supabase) => {
    try {
      // パスパラメータからIDを取得する
      const params = await context.params
      const questId = Number(params.id)

      // bodyから家族クエストを取得する
      const body = await req.json()
      const data = DeleteFamilyQuestRequestSchema.parse(body)

      // 家族クエストを削除する
      await deleteFamilyQuest({
        supabase,
        quest: {
          id: questId,
          updated_at: data.quest.updated_at,
        }
      })

      return NextResponse.json({})
    } catch (err) {
      return handleServerError(err)
    }
  })
}
