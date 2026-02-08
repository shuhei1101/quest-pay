import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { FamilyTimelineInsert, familyTimelines, PublicTimelineInsert, publicTimelines } from "@/drizzle/schema"
import { Db } from "@/index"

/** 家族タイムラインを挿入する */
export type InsertFamilyTimelineRecord = FamilyTimelineInsert
export const insertFamilyTimeline = async ({db, record}: {
  db: Db
  record: InsertFamilyTimelineRecord
}) => {
  try {
    // 家族タイムラインを挿入する
    const [newTimeline] = await db.insert(familyTimelines).values({
      ...record,
    }).returning({ id: familyTimelines.id })
    return {
      id: newTimeline.id
    } 
  } catch (error) {
    devLog("insertFamilyTimeline error:", error)
    throw new DatabaseError("家族タイムラインの登録に失敗しました。")
  }
}

/** 公開タイムラインを挿入する */
export type InsertPublicTimelineRecord = PublicTimelineInsert
export const insertPublicTimeline = async ({db, record}: {
  db: Db
  record: InsertPublicTimelineRecord
}) => {
  try {
    // 公開タイムラインを挿入する
    const [newTimeline] = await db.insert(publicTimelines).values({
      ...record,
    }).returning({ id: publicTimelines.id })
    return {
      id: newTimeline.id
    } 
  } catch (error) {
    devLog("insertPublicTimeline error:", error)
    throw new DatabaseError("公開タイムラインの登録に失敗しました。")
  }
}
