import { generateInviteCode } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { families, publicQuests, templateQuests, icons } from "@/drizzle/schema"
import { and, eq, sql } from "drizzle-orm"

/** 家族を取得する */
export const fetchFamily = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {

    // データを取得する（アイコン情報を含む）
    const rows = await db
      .select()
      .from(families)
      .leftJoin(icons, eq(families.iconId, icons.id))
      .where(eq(families.id, familyId))
      .limit(1)


      return rows[0]
  } catch (error) {
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
    throw new QueryError("家族統計情報の取得に失敗しました。")
  }
}

/** 家族のメンバー統計を取得する */
export const fetchFamilyMemberStats = async ({db, familyId}: {
  db: Db,
  familyId: string
}) => {
  try {
    const { profiles } = await import("@/drizzle/schema")
    
    // 親の数を取得する
    const parentCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(profiles)
      .where(
        and(
          eq(profiles.familyId, familyId),
          eq(profiles.type, "parent")
        )
      )

    // 子供の数を取得する
    const childCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(profiles)
      .where(
        and(
          eq(profiles.familyId, familyId),
          eq(profiles.type, "child")
        )
      )

    return {
      parentCount: parentCountResult[0]?.count ?? 0,
      childCount: childCountResult[0]?.count ?? 0,
    }
  } catch (error) {
    throw new QueryError("家族メンバー統計の取得に失敗しました。")
  }
}

/** 家族のクエスト実績統計を取得する */
export const fetchFamilyQuestStats = async ({db, familyId}: {
  db: Db,
  familyId: string
}) => {
  try {
    const { questChildren, familyQuests } = await import("@/drizzle/schema")
    
    // 総クエスト数を取得する
    const totalQuestCountResult = await db
      .select({ count: sql<number>`count(DISTINCT ${familyQuests.id})::int` })
      .from(familyQuests)
      .where(eq(familyQuests.familyId, familyId))

    // 完了したクエスト数を取得する
    const completedQuestCountResult = await db
      .select({ count: sql<number>`count(DISTINCT ${familyQuests.id})::int` })
      .from(questChildren)
      .leftJoin(familyQuests, eq(questChildren.familyQuestId, familyQuests.id))
      .where(
        and(
          eq(familyQuests.familyId, familyId),
          eq(questChildren.status, "completed")
        )
      )

    // 進行中のクエスト数を取得する
    const inProgressQuestCountResult = await db
      .select({ count: sql<number>`count(DISTINCT ${familyQuests.id})::int` })
      .from(questChildren)
      .leftJoin(familyQuests, eq(questChildren.familyQuestId, familyQuests.id))
      .where(
        and(
          eq(familyQuests.familyId, familyId),
          eq(questChildren.status, "in_progress")
        )
      )

    return {
      totalCount: totalQuestCountResult[0]?.count ?? 0,
      completedCount: completedQuestCountResult[0]?.count ?? 0,
      inProgressCount: inProgressQuestCountResult[0]?.count ?? 0,
    }
  } catch (error) {
    throw new QueryError("家族クエスト実績統計の取得に失敗しました。")
  }
}
