import { eq, and } from "drizzle-orm"
import { Db } from "@/index"
import { follows } from "@/drizzle/schema"
import { devLog } from "@/app/(core)/util"
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

    devLog("insertFollow success")
  } catch (error) {
    devLog("insertFollow error:", error)
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

    devLog("deleteFollow success")
  } catch (error) {
    devLog("deleteFollow error:", error)
    throw new DatabaseError("フォローの解除に失敗しました。")
  }
}
