import { NextRequest, NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { withAuth } from "@/app/(core)/withAuth"
import { deleteQuest, updateQuest } from "../db"
import { fetchFamilyQuest } from "./query"
import { FamilyQuestGetResponse } from "./schema"

/** 家族クエストを取得する */
export async function GET(
  { params }: { params: { id: number } }
) {
  return withAuth(async (supabase) => {
    try {
      // パスパラメータからIDを取得する
      const id = params.id
      
      // 家族クエストを取得する
      const data = await fetchFamilyQuest({supabase, questId: id })
  
      return NextResponse.json(data as FamilyQuestGetResponse)
    } catch (err) {
      return handleServerError(err)
    }
  })
}

/** 家族クエストを更新する */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  return withAuth(async (supabase, userId) => {
    try {
      // パスパラメータからIDを取得する
      const id = params.id

      // bodyから家族クエストを取得する
      const body = await request.json()
      const data = QuestPutRequestSchema.parse(body)

      // 家族クエストを更新する
      await updateQuest({
        tags: data.tags,
        quest: {
          icon: data.quest.icon,
          type: "family",
          name: data.quest.name,
          id: id,
          updated_at: data.quest.updated_at
        },
        supabase
      })
      
      // メッセージを返却する
      return NextResponse.json({})
    } catch (err) {
      return handleServerError(err)
    }
  })
}

/** 家族クエストを削除する */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  return withAuth(async (supabase, userId) => {
    try {
      // パスパラメータからIDを取得する
      const id = params.id

      // bodyから家族クエストを取得する
      const body = await request.json()
      const data = DeleteQuestRequestSchema.parse(body)

      // 家族クエストを削除する
      await deleteQuest({
        supabase,
        quest: {
          id,
          updated_at: data.updated_at,
        }
      })

      return NextResponse.json({})
    } catch (err) {
      return handleServerError(err)
    }
  })
}
