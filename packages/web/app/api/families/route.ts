import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { registerFamilyAndParent } from "./service"
import { generateUniqueInviteCode } from "./invite/service"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { FamilyRegisterFormSchema, FamilyRegisterFormType } from "@/app/(app)/families/new/form"
import z from "zod"
import { logger } from "@/app/(core)/logger"

/** 家族を登録する */
export const PostFamilyRequestSchema = z.object({
  form: FamilyRegisterFormSchema
})
export type PostFamilyRequest = z.infer<typeof PostFamilyRequestSchema>
export async function POST(
  request: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族登録API開始', {
      path: request.nextUrl.pathname,
      method: request.method,
    })
    
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })
    
    // bodyから家族を取得する
    const body = await request.json()
    const data = PostFamilyRequestSchema.parse(body)
    logger.debug('リクエストバリデーション完了', {
      displayId: data.form.displayId,
      localName: data.form.localName,
      onlineName: data.form.onlineName,
    })
    
    // 招待コードを生成する
    const inviteCode = await generateUniqueInviteCode({db})
    logger.debug('招待コード生成完了', { inviteCode })
    
    // 家族を登録する
    logger.info('家族登録処理開始', {
      userId,
      familyDisplayId: data.form.displayId,
    })
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
    
    logger.info('家族登録処理完了', {
      userId,
      familyDisplayId: data.form.displayId,
    })
    return NextResponse.json({})
  })
}
