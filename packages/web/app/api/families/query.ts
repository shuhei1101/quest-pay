import { devLog, generateInviteCode } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { families, publicQuests, templateQuests } from "@/drizzle/schema"
import { and, eq, sql } from "drizzle-orm"

/** 家族を取得する */
export const fetchFamily = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {

    // データを取得する
    const rows = await db
      .select()
      .from(families)
      .where(eq(families.id, familyId))
      .limit(1)

      devLog("fetchFamily.取得データ: ", rows)

      return rows[0]
  } catch (error) {
    devLog("fetchFamily.取得例外: ", error)
    throw new QueryError("家族情報の読み込みに失敗しました。")
  }
}

/** 使用可能な家族招待コードか確認する */
export const getFamilyByInviteCode = async ({db, code}: {
  db: Db,
  code: string
}) => {
  try {
    // データを取得する
    const rows = await db
      .select()
      .from(families)
      .where(eq(families.inviteCode, code))

    return rows[0]
  } catch (error) {
    devLog("getFamilyByInviteCode.取得例外: ", error)
    throw new QueryError("家族招待コードの生成に失敗しました。")
  }
}

/** 家族の統計情報を取得する */
export const fetchFamilyStats = async ({db, familyId}: {
  db: Db,
  familyId: string
}) => {
  try {
    // 公開クエスト数を取得する
    const publicQuestCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(publicQuests)
      .where(
        and(
          eq(publicQuests.familyId, familyId),
          eq(publicQuests.isActivate, true)
        )
      )

    // いいね数（テンプレートクエスト登録数）を取得する
    const likeCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(templateQuests)
      .leftJoin(publicQuests, eq(templateQuests.publicQuestId, publicQuests.id))
      .where(eq(publicQuests.familyId, familyId))

    return {
      publicQuestCount: publicQuestCountResult[0]?.count ?? 0,
      likeCount: likeCountResult[0]?.count ?? 0,
    }
  } catch (error) {
    devLog("fetchFamilyStats error:", error)
    throw new QueryError("家族統計情報の取得に失敗しました。")
  }
}
