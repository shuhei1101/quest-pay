import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { children, icons, profiles, questChildren } from "@/drizzle/schema"
import { eq, and, or, sql } from "drizzle-orm"

/** 家族IDに一致する子供を取得する */
export const fetchChildrenByFamilyId = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .leftJoin(profiles, eq(children.profileId, profiles.id))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(profiles.familyId, familyId))

    devLog("fetchChildrenByFamilyId.取得データ: ", data, "app/api/children/query.ts")

    return data
  } catch (error) {
    devLog("fetchChildrenByFamilyId.取得例外: ", error, "app/api/children/query.ts")
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

export type Child = Awaited<ReturnType<typeof fetchChild>>

/** 子供IDに一致する子供を取得する */
export const fetchChild = async ({ db,  childId }: {
  db: Db,
  childId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .leftJoin(profiles, eq(children.profileId, profiles.id))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(children.id, childId))

    devLog("fetchChild.取得データ: ", data)

    return data[0]
  } catch (error) {
    devLog("fetchChild.取得例外: ", error, "app/api/children/query.ts")
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

/** 招待コードに紐づく子供を取得する */
export const fetchChildByInviteCode = async ({db, invite_code}: {
  db: Db,
  invite_code: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .where(eq(children.inviteCode, invite_code))


  return data[0]
  } catch (error) {
    devLog("getChildByInviteCode.取得例外: ", error)
    throw new QueryError("招待コードの生成に失敗しました。", "app/api/children/query.ts")
  }
}

/** 子供のクエスト統計を取得する */
export const fetchChildQuestStats = async ({db, childId}: {
  db: Db,
  childId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select({
        inProgressCount: sql<number>`COUNT(CASE WHEN ${questChildren.status} IN ('in_progress', 'pending_review') THEN 1 END)::int`,
        completedCount: sql<number>`COUNT(CASE WHEN ${questChildren.status} = 'completed' THEN 1 END)::int`,
      })
      .from(questChildren)
      .where(eq(questChildren.childId, childId))

    devLog("fetchChildQuestStats.取得データ: ", data, "app/api/children/query.ts")

    return data[0] ?? { inProgressCount: 0, completedCount: 0 }
  } catch (error) {
    devLog("fetchChildQuestStats.取得例外: ", error, "app/api/children/query.ts")
    throw new QueryError("クエスト統計の読み込みに失敗しました。")
  }
}
