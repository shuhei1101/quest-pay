import { eq, and, sql } from "drizzle-orm"
import { Db } from "@/index"
import { follows } from "@/drizzle/schema"
import { devLog } from "@/app/(core)/util"
import { DatabaseError } from "@/app/(core)/error/appError"

/** フォロー状態を取得する */
export const fetchFollowStatus = async ({db, followerFamilyId, followFamilyId}: {
  db: Db
  followerFamilyId: string
  followFamilyId: string
}) => {
  try {
    const rows = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerFamilyId, followerFamilyId),
          eq(follows.followFamilyId, followFamilyId)
        )
      )
      .limit(1)

    return rows[0] !== undefined
  } catch (error) {
    devLog("fetchFollowStatus error:", error)
    throw new DatabaseError("フォロー状態の取得に失敗しました。")
  }
}

/** フォロワー数とフォロー数を取得する */
export const fetchFollowCount = async ({db, familyId}: {
  db: Db
  familyId: string
}) => {
  try {
    // フォロワー数を取得する
    const followerCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followFamilyId, familyId))
    
    // フォロー数を取得する
    const followingCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followerFamilyId, familyId))

    return {
      followerCount: followerCountResult[0]?.count ?? 0,
      followingCount: followingCountResult[0]?.count ?? 0,
    }
  } catch (error) {
    devLog("fetchFollowCount error:", error)
    throw new DatabaseError("フォロー数の取得に失敗しました。")
  }
}
