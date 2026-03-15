import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "@/app/api/users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchFamilyQuest } from "../../query"
import { registerPublicQuestByFamilyQuest } from "../../../public/service"
import { fetchPublicQuestByFamilyId } from "../../../public/query"
import { logger } from "@/app/(core)/logger"


/** 家族クエストを公開する */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    logger.info('家族クエスト公開API開始', {
      path: '/api/quests/family/[id]/publish',
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

    // 現在の家族クエストを取得する
    const currentFamilyQuest = await fetchFamilyQuest({ db, id })

    // 家族IDが一致しない場合
    if (userInfo.profiles.familyId !== currentFamilyQuest?.base.familyId) {
      logger.warn('異なる家族のクエスト公開試行', {
        userId,
        userFamilyId: userInfo.profiles.familyId,
        questFamilyId: currentFamilyQuest?.base.familyId,
      })
      throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
    }

    // 既に登録されていないか確認する
    const existingPublicQuest = await fetchPublicQuestByFamilyId({db, familyQuestId: id})
    if (existingPublicQuest) {
      logger.warn('既に公開済みのクエスト公開試行', { familyQuestId: id })
      throw new ServerError("この家族クエストは既に公開されています。")
    }
      
    // 家族クエストを公開する
    await registerPublicQuestByFamilyQuest({
      db,
      familyQuestId: id
    })
    logger.debug('公開クエスト登録完了', { familyQuestId: id })
    
    logger.info('家族クエスト公開成功', { familyQuestId: id })

    return NextResponse.json({})
  })
}
