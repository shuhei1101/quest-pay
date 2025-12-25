import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { QuestDetailInsert, questDetails, QuestSelect } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq } from "drizzle-orm"

export type InsertQuestDetailRecord = Omit<QuestDetailInsert, "id" | "createdAt" | "updatedAt" | "questId">

/** クエスト詳細をバルクインサートする */
export const insertQuestDetails = async ({db, records, questId}: {
  db: Db,
  records: InsertQuestDetailRecord[]
  questId: QuestSelect["id"]
}) => {
  try {
    // クエスト詳細を挿入する
    await db.insert(questDetails).values(records.map(record => ({ ...record, questId }))).execute()
  } catch (error) {
    devLog("insertQuestDetails error:", error)
    throw new DatabaseError("クエスト詳細の登録に失敗しました。")
  }
}

/** クエストIDに一致するクエスト詳細を削除する */
export const deleteQuestDetails = async ({db, questId}: {
  db: Db,
  questId: QuestSelect["id"]
}) => {
  try {
    // クエスト詳細を削除する
    await db.delete(questDetails).where(eq(questDetails.questId, questId)).execute()
  } catch (error) {
    devLog("deleteQuestDetailsByQuestId error:", error)
    throw new DatabaseError("クエスト詳細の削除に失敗しました。")
  }
}
