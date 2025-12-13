import { NextRequest, NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { withAuth } from "@/app/(core)/withAuth"
import { PostChildRequestSchema, PostChildResponse } from "./schema"
import { insertChild } from "./db"
import { generateUniqueInviteCode } from "./invite/service"
import { fetchUserInfo } from "../users/login/query"
import { ServerError } from "@/app/(core)/appError"



/** 子供を登録する */
export async function POST(
  request: NextRequest,
) {
  return withAuth(async (supabase, userId) => {
    try {
      // bodyから子供を取得する
      const body = await request.json()
      const data  = PostChildRequestSchema.parse(body)

     // 家族IDを取得する
      const userInfo = await fetchUserInfo({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({supabase})
        
      // 子供を登録する
      const childId = await insertChild({
        profile: {
          name: data.child.name,
          icon_id: data.child.icon_id,
          icon_color: data.child.icon_color,
          birthday: data.child.birthday
        },
        child: {
          invite_code: inviteCode
        },
        supabase: supabase,
        familyId: userInfo.family_id
      })

      return NextResponse.json({childId} as PostChildResponse)
    } catch (err) {
      return handleServerError(err)
    }
  })
}
