import { and, count, desc, eq } from "drizzle-orm"
import { Db } from "@/index"
import { families, familyTimelines, icons, profiles, publicQuests, templateQuests } from "@/drizzle/schema"
import { devLog } from "@/app/(core)/util"
import { DatabaseError } from "@/app/(core)/error/appError"

/** 家族プロフィール情報を取得する */
export const fetchFamilyProfile = async ({db, familyId}: {
  db: Db
  familyId: string
}) => {
  try {
    // 家族基本情報を取得する
    const familyRows = await db
      .select()
      .from(families)
      .leftJoin(icons, eq(families.iconId, icons.id))
      .where(eq(families.id, familyId))
      .limit(1)

    if (!familyRows[0]) {
      throw new DatabaseError("家族情報が見つかりません。")
    }

    const family = familyRows[0]

    // 公開クエスト数を取得する
    const publicQuestCountResult = await db
      .select({ count: count() })
      .from(publicQuests)
      .where(
        and(
          eq(publicQuests.familyId, familyId),
          eq(publicQuests.isActivate, true)
        )
      )
    
    const publicQuestCount = publicQuestCountResult[0]?.count || 0

    // お気に入り登録数（テンプレートクエスト数）を取得する
    const likeCountResult = await db
      .select({ count: count() })
      .from(templateQuests)
      .innerJoin(publicQuests, eq(templateQuests.publicQuestId, publicQuests.id))
      .where(eq(publicQuests.familyId, familyId))
    
    const likeCount = likeCountResult[0]?.count || 0

    // 最新のタイムラインを取得する（最大20件）
    const timelines = await db
      .select()
      .from(familyTimelines)
      .leftJoin(profiles, eq(familyTimelines.profileId, profiles.id))
      .where(eq(familyTimelines.familyId, familyId))
      .orderBy(desc(familyTimelines.createdAt))
      .limit(20)

    return {
      family,
      publicQuestCount,
      likeCount,
      timelines
    }
  } catch (error) {
    devLog("fetchFamilyProfile error:", error)
    throw new DatabaseError("家族プロフィール情報の取得に失敗しました。")
  }
}
