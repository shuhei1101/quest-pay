import { desc, eq } from "drizzle-orm"
import { Db } from "@/index"
import { publicTimelines, families } from "@/drizzle/schema"
import { devLog } from "@/app/(core)/util"
import { DatabaseError } from "@/app/(core)/error/appError"

/** 公開タイムラインを取得する */
export const fetchPublicTimelines = async ({db, limit = 50}: {
  db: Db
  limit?: number
}) => {
  try {
    const timelineList = await db
      .select({
        id: publicTimelines.id,
        familyId: publicTimelines.familyId,
        type: publicTimelines.type,
        message: publicTimelines.message,
        publicQuestId: publicTimelines.publicQuestId,
        createdAt: publicTimelines.createdAt,
        updatedAt: publicTimelines.updatedAt,
        familyOnlineName: families.onlineName,
        familyIconId: families.iconId,
        familyIconColor: families.iconColor,
      })
      .from(publicTimelines)
      .leftJoin(families, eq(publicTimelines.familyId, families.id))
      .orderBy(desc(publicTimelines.createdAt))
      .limit(limit)

    return timelineList
  } catch (error) {
    devLog("fetchPublicTimelines error:", error)
    throw new DatabaseError("公開タイムラインの取得に失敗しました。")
  }
}
