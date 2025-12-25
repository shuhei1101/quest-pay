import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { PostFamilyRequestScheme, PostFamilyResponse } from "./scheme"
import { registerFamilyAndParent } from "./service"
import { generateUniqueInviteCode } from "./invite/service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"

/** 家族を登録する */
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // bodyから家族を取得する
      const body = await request.json()
      const data  = PostFamilyRequestScheme.parse(body)

      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({db})
        
      // 家族を登録する
      await registerFamilyAndParent({
        db,
        family: {
          displayId: data.form.displayId,
          inviteCode: inviteCode,
          iconColor: data.form.familyIconColor,
          iconId: data.form.familyIconId,
          localName: data.form.localName,
          onlineName: data.form.onlineName
        },
        profile: {
          name: data.form.parentName,
          iconId: data.form.parentIconId,
          iconColor: data.form.parentIconColor,
        },
        parent: {
          inviteCode: inviteCode
        }
      })
      return NextResponse.json({})
    })

}
