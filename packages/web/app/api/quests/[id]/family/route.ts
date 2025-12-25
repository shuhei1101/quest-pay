import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchFamilyQuest } from "../../family/query"
import { DeleteFamilyQuestRequestScheme, GetFamilyQuestResponse, PutFamilyQuestRequestScheme } from "./scheme"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { deleteFamilyQuest, editFamilyQuest } from "../../family/service"
import { devLog } from "@/app/(core)/util"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 家族クエストを取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params
      const questId = params.id
      
      devLog("GetFamilyQuest.パラメータ.ID: ", params.id)
      
      // 家族クエストを取得する
      const data = await fetchFamilyQuest({ db, questId })
      
      devLog("取得した家族クエスト: ", data)
  
      return NextResponse.json({quest: data} as GetFamilyQuestResponse)
    })
}

/** 家族クエストを更新する */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params
      const questId = params.id

      // bodyから家族クエストを取得する
      const body = await req.json()
      const data = PutFamilyQuestRequestScheme.parse(body)

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, db})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 家族クエストを更新する
      await editFamilyQuest({
        params: {
          _quest_id: data.questId,
          _name: data.form.name,
          _is_public: data.form.isPublic,
          _type: "family",
          _icon_id: data.form.iconId,
          _icon_color: data.form.iconColor,
          _tags: data.form.tags,
          _category_id: 0
        },
        updated_at: data.updatedAt,
        db,
      })
      
      return NextResponse.json({})
    })
}

/** 家族クエストを削除する */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // パスパラメータからIDを取得する
      const params = await context.params
      const questId = params.id

      // bodyから家族クエストを取得する
      const body = await req.json()
      const data = DeleteFamilyQuestRequestScheme.parse(body)

      // 家族クエストを削除する
      await deleteFamilyQuest({
        db,
        params: {
          _quest_id: data.questId
        },
        updatedAt: data.updatedAt,
      })

      return NextResponse.json({})
    })
}
