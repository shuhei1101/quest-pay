import { NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { registerTemplateQuestByPublicQuest } from "../../../template/service"
import { logger } from "@/app/(core)/logger"


/** 家族クエスト */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('公開クエストいいねAPI開始', {
      path: '/api/quests/public/[id]/like',
      method: 'POST',
    })

    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    logger.debug('認証コンテキスト取得完了', { userId })

    // パスパラメータからIDを取得する
    const { id } = await context.params

    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    if (!userInfo?.profiles?.familyId) throw new ServerError("家族IDの取得に失敗しました。")
    logger.debug('プロフィール情報取得完了', { familyId: userInfo.profiles.familyId })

    // 公開クエストをテンプレートクエストとして登録する（いいねする）
    await registerTemplateQuestByPublicQuest({
      db,
      publicQuestId: id,
      familyId: userInfo.profiles.familyId
    })
    logger.debug('テンプレートクエスト登録完了', { publicQuestId: id, familyId: userInfo.profiles.familyId })
    
    logger.info('公開クエストいいね成功', { publicQuestId: id })

    return NextResponse.json({})
  })
}
