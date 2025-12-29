import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { registerFamilyAndParent } from "./service"
import { generateUniqueInviteCode } from "./invite/service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { FamilyRegisterFormSchema, FamilyRegisterFormType } from "@/app/(app)/families/new/form"
import z from "zod"

/** 家族を登録する */
export const PostFamilyRequestSchema = z.object({
  form: FamilyRegisterFormSchema
})
export type PostFamilyRequest = z.infer<typeof PostFamilyRequestSchema>
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
      // bodyから家族を取得する
      const body = await request.json()
      const data = PostFamilyRequestSchema.parse(body)
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
          onlineName: data.form.onlineName,
        },
        profile: {
          userId: userId,
          birthday: data.form.parentBirthday,
          name: data.form.parentName,
          iconId: data.form.parentIconId,
          iconColor: data.form.parentIconColor,
        },
        parent: {
          inviteCode: inviteCode,
        }
      })
      return NextResponse.json({})
    })

}
