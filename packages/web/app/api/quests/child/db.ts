import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { FamilyQuestSelect, questChildren, QuestChildrenInsert, QuestSelect } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq } from "drizzle-orm"

export type InsertQuestChildrenRecord = Omit<QuestChildrenInsert, "familyQuestId">

/** クエスト対象の子供をバルクインサートする */
export const insertQuestChildren = async ({db, records, familyQuestId}: {
  db: Db,
  records: InsertQuestChildrenRecord[],
  familyQuestId: FamilyQuestSelect["id"]
}) => {
  try {
    // クエスト対象の子供を挿入する
    await db.insert(questChildren).values(records.map(record => ({ 
      ...record,
      familyQuestId
     }))).execute()
  } catch (error) {
    devLog("insertQuestChildren error:", error)
    throw new DatabaseError("クエスト対象の子供の登録に失敗しました。")
  }
}

/** 家族クエストIDに一致するクエスト対象の子供を削除する */
export const deleteQuestChildren = async ({db, familyQuestId}: {
  db: Db,
  familyQuestId: FamilyQuestSelect["id"]
}) => {
  try {
    // クエスト対象の子供を削除する
    await db.delete(questChildren).where(eq(questChildren.familyQuestId, familyQuestId)).execute()
  } catch (error) {
    devLog("deleteQuestChildrenByQuestId error:", error)
    throw new DatabaseError("クエスト対象の子供の削除に失敗しました。")
  }
}
