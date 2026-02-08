import { and, desc, eq } from "drizzle-orm"
import { Db } from "@/index"
import { familyTimelines, profiles } from "@/drizzle/schema"
import { devLog } from "@/app/(core)/util"
import { DatabaseError } from "@/app/(core)/error/appError"

/** 家族タイムラインを取得する */
export const fetchFamilyTimelines = async ({db, familyId, limit = 50}: {
  db: Db
  familyId: string
  limit?: number
}) => {
  try {
    const timelineList = await db
      .select({
        id: familyTimelines.id,
        familyId: familyTimelines.familyId,
        profileId: familyTimelines.profileId,
        type: familyTimelines.type,
        message: familyTimelines.message,
        questId: familyTimelines.questId,
        createdAt: familyTimelines.createdAt,
        updatedAt: familyTimelines.updatedAt,
        profileName: profiles.name,
        profileIconId: profiles.iconId,
        profileIconColor: profiles.iconColor,
      })
      .from(familyTimelines)
      .leftJoin(profiles, eq(familyTimelines.profileId, profiles.id))
      .where(eq(familyTimelines.familyId, familyId))
      .orderBy(desc(familyTimelines.createdAt))
      .limit(limit)

    return timelineList
  } catch (error) {
    devLog("fetchFamilyTimelines error:", error)
    throw new DatabaseError("家族タイムラインの取得に失敗しました。")
  }
}
