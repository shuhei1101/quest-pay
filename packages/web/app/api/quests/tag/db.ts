import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { QuestSelect, questTags, QuestTagsInsert } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq } from "drizzle-orm"

export type InsertQuestTagsRecord = Omit<QuestTagsInsert, "id" | "createdAt" | "updatedAt">

/** クエストタグをバルクインサートする */
export const insertQuestTags = async ({db, records, questId}: {
  db: Db,
  records: InsertQuestTagsRecord[]
  questId: QuestSelect["id"]
}) => {
  try {
    // クエストタグを挿入する
    await db.insert(questTags).values(records.map(record => ({ ...record, questId })) ).execute()
  } catch (error) {
    devLog("insertQuestTags error:", error)
    throw new DatabaseError("クエストタグの登録に失敗しました。")
  }
}

/** クエストタグを削除する */
export const deleteQuestTags = async ({db, questId}: {
  db: Db,
  questId: QuestSelect["id"]
}) => {
  try {
    // クエストタグを削除する
    await db.delete(questTags).where(eq(questTags.questId, questId)).execute()
  } catch (error) {
    devLog("deleteQuestTagsByQuestId error:", error)
    throw new DatabaseError("クエストタグの削除に失敗しました。")
  }
}
