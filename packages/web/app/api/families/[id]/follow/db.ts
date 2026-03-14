import { eq, and } from "drizzle-orm"
import { Db } from "@/index"
import { follows } from "@/drizzle/schema"
import { logger } from "@/app/(core)/logger"
import { DatabaseError } from "@/app/(core)/error/appError"

/** フォローを追加する */
export const insertFollow = async ({db, followerFamilyId, followFamilyId}: {
  db: Db
  followerFamilyId: string
  followFamilyId: string
}) => {
  try {
    await db
      .insert(follows)
      .values({
        followerFamilyId,
        followFamilyId,
      })

    logger.debug("insertFollow success")
  } catch (error) {
    logger.error("insertFollow error", { error })
    throw new DatabaseError("フォローの追加に失敗しました。")
  }
}

/** フォローを削除する */
export const deleteFollow = async ({db, followerFamilyId, followFamilyId}: {
  db: Db
  followerFamilyId: string
  followFamilyId: string
}) => {
  try {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerFamilyId, followerFamilyId),
          eq(follows.followFamilyId, followFamilyId)
        )
      )

    logger.debug("deleteFollow success")
  } catch (error) {
    logger.error("deleteFollow error", { error })
    throw new DatabaseError("フォローの解除に失敗しました。")
  }
}
