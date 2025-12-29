import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { QuestInsert, quests, QuestUpdate } from "@/drizzle/schema"
import { Db } from "@/index"
import { questExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

/** クエストを挿入する */
export const insertQuest = async ({db, record}: {
  db: Db,
  record: QuestInsert
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
export const updateQuest = async ({db, record, id, updatedAt}: {
  db: Db,
  record: QuestUpdate
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

/** クエストを削除する */
export const deleteQuest = async ({db, id, updatedAt}: {
  db: Db,
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

    // クエストを削除する
    await db.delete(quests).where(eq(quests.id, id)).execute()
    
  } catch (error) {
    devLog("deleteQuest error:", error)
    throw new DatabaseError("クエストの削除に失敗しました。")
  }
}
