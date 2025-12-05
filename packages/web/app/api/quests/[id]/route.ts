import { NextRequest, NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { DeleteQuestRequestSchema } from "@/app/(child)/children/api/schema"
import { withAuth } from "@/app/(core)/withAuth"
import { QuestGetResponse, QuestPutRequestSchema } from "./schema"
import { fetchQuest } from "../query"
import { deleteQuest, updateQuest } from "../db"

/** クエストを取得する */
export async function GET(
  { params }: { params: { id: number } }
) {
  return withAuth(async (supabase) => {
    try {
      // パスパラメータからIDを取得する
      const id = params.id
      
      // クエストを取得する
      const quest = await fetchQuest({supabase, id })
  
      return NextResponse.json({ quest } as QuestGetResponse)
    } catch (err) {
      return handleServerError(err)
    }
  })
}

/** クエストを更新する */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  return withAuth(async (supabase, userId) => {
    try {
      // パスパラメータからIDを取得する
      const id = params.id

      // bodyからクエストを取得する
      const body = await request.json()
      const data = QuestPutRequestSchema.parse(body)

      // クエストを更新する
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

/** クエストを削除する */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  return withAuth(async (supabase, userId) => {
    try {
      // パスパラメータからIDを取得する
      const id = params.id

      // bodyからクエストを取得する
      const body = await request.json()
      const data = DeleteQuestRequestSchema.parse(body)

      // クエストを削除する
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
