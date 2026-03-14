import { eq, and } from "drizzle-orm"
import { Db } from "@/index"
import { follows } from "@/drizzle/schema"
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

  } catch (error) {
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

  } catch (error) {
    throw new DatabaseError("フォローの解除に失敗しました。")
  }
}
