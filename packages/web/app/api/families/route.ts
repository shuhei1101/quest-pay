import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { PostFamilyRequestScheme, PostFamilyResponse } from "./scheme"
import { insertFamilyAndParent } from "./db"
import { generateUniqueInviteCode } from "./invite/service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 家族を登録する */
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // bodyから家族を取得する
      const body = await request.json()
      const data  = PostFamilyRequestScheme.parse(body)

      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({supabase})
        
      // 家族を登録する
      await insertFamilyAndParent({
        params: {
          _user_id: userId,
          _display_id: data.form.displayId,
          _local_name: data.form.localName,
          _online_name: data.form.onlineName,
          _family_icon_id: data.form.familyIconId,
          _family_icon_color: data.form.familyIconColor,
          _family_invite_code: inviteCode,
          _parent_name: data.form.parentName,
          _parent_icon_id: data.form.parentIconId,
          _parent_icon_color: data.form.parentIconColor,
          _parent_birthday: data.form.parentBirthday,
        },
        supabase: supabase,
      })
      return NextResponse.json({})
    })
  })
}
