import { desc, eq } from "drizzle-orm"
import { Db } from "@/index"
import { publicTimelines, families } from "@/drizzle/schema"
import { logger } from "@/app/(core)/logger"
import { DatabaseError } from "@/app/(core)/error/appError"

/** 公開タイムラインを取得する */
export const fetchPublicTimelines = async ({db, limit = 50}: {
  db: Db
  limit?: number
}) => {
  try {
    const timelineList = await db
      .select()
      .from(publicTimelines)
      .leftJoin(families, eq(publicTimelines.familyId, families.id))
      .orderBy(desc(publicTimelines.createdAt))
      .limit(limit)

    return timelineList
  } catch (error) {
    logger.error("fetchPublicTimelines error", { error })
    throw new DatabaseError("公開タイムラインの取得に失敗しました。")
  }
}
