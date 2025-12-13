import { NextRequest, NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { withAuth } from "@/app/(core)/withAuth"
import { PostFamilyRequestSchema, PostFamilyResponse } from "./schema"
import { insertFamily } from "./db"
import { generateUniqueInviteCode } from "./invite/service"

/** 家族を登録する */
export async function POST(
  request: NextRequest,
) {
  return withAuth(async (supabase, userId) => {
    try {
      // bodyから家族を取得する
      const body = await request.json()
      const data  = PostFamilyRequestSchema.parse(body)

      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({supabase})
        
      // 家族を登録する
      await insertFamily({
        family: {
          ...data.family,
          invite_code: inviteCode
        },
        parent: data.parent,
        supabase: supabase,
        userId: userId,
      })
      return NextResponse.json({})
    } catch (err) {
      return handleServerError(err)
    }
  })
}
