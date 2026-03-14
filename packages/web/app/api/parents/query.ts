import { logger } from "@/app/(core)/logger"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { icons, parents, profiles, questChildren } from "@/drizzle/schema"
import { eq, and, sql, count } from "drizzle-orm"

export type Parents = Parent[]

/** 家族IDに一致する親を取得する */
export const fetchFamilyParents = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(parents)
      .leftJoin(profiles, eq(profiles.id, parents.profileId))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(profiles.familyId, familyId))

    logger.debug("親一覧取得完了", { data })

    return data as Parents
  } catch (error) {
    logger.error("親一覧取得失敗", { error })
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}

export type Parent = Awaited<ReturnType<typeof fetchParent>>

/** IDに一致する親を取得する */
export const fetchParent = async ({ db, parentId }: {
  db: Db,
  parentId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(parents)
      .leftJoin(profiles, eq(profiles.id, parents.profileId))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(parents.id, parentId))
    logger.debug("親情報取得完了", { data })

    return data[0]
  } catch (error) {
    logger.error("親情報取得失敗", { error })
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}

/** 親の統計情報を取得する */
export const fetchParentStats = async ({ db, profileId, familyId }: {
  db: Db,
  profileId: string,
  familyId: string
}) => {
  try {
    // 承認した回数：quest_childrenのlastApprovedByがこの親のprofileIdで、statusがcompletedのもの
    const approvedCountResult = await db
      .select({ count: count() })
      .from(questChildren)
      .where(
        and(
          eq(questChildren.lastApprovedBy, profileId),
          eq(questChildren.status, "completed")
        )
      )
    
    const approvedCount = approvedCountResult[0]?.count ?? 0

    // 却下した回数：quest_childrenのlastApprovedByがこの親のprofileIdで、
    // statusがcompletedでないもの（却下されてpending_reviewに戻された or in_progressに戻された）
    // ただし、lastApprovedByが設定されているということは、親が何らかのアクションをしたことを示す
    const rejectedCountResult = await db
      .select({ count: count() })
      .from(questChildren)
      .where(
        and(
          eq(questChildren.lastApprovedBy, profileId),
          sql`${questChildren.status} != 'completed'`
        )
      )
    
    const rejectedCount = rejectedCountResult[0]?.count ?? 0

    logger.debug("親統計情報取得完了", { approvedCount, rejectedCount })

    return {
      approvedCount,
      rejectedCount
    }
  } catch (error) {
    logger.error("親統計情報取得失敗", { error })
    throw new QueryError("親の統計情報の読み込みに失敗しました。")
  }
}
