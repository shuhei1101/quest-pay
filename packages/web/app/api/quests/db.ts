import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { QuestDetailInsert, questDetails, QuestInsert, quests, QuestUpdate } from "@/drizzle/schema"
import { Db } from "@/index"
import { questExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

/** クエストを挿入する */
export type InsertQuestRecord = Omit<QuestInsert, "id" | "createdAt" | "updatedAt">
export const insertQuest = async ({db, record}: {
  db: Db,
  record: InsertQuestRecord
}) => {
  try {
    // クエストを挿入する
    const [newQuest] = await db.insert(quests).values(record).returning({ id: quests.id })
    return {
      id: newQuest.id
    } 
  } catch (error) {
    devLog("insertQuest error:", error)
    throw new DatabaseError("クエストの登録に失敗しました。")
  }
}

/** クエストを更新する */
export type UpdateQuestRecord = Partial<Omit<QuestUpdate, "createdAt">>
export const updateQuest = async ({db, record, id, updatedAt}: {
  db: Db,
  record: UpdateQuestRecord
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeQuest = await questExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await questExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeQuest.updatedAt,
      afterDate: updatedAt,
    })

    // クエストを更新する
    await db.update(quests).set(record).where(eq(quests.id, id))
    
  } catch (error) {
    devLog("updateQuest error:", error)
    throw new DatabaseError("クエストの更新に失敗しました。")
  }
}
