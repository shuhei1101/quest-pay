import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { TemplateQuestInsert, templateQuests, TemplateQuestUpdate, questDetails, quests } from "@/drizzle/schema"
import { Db } from "@/index"
import { templateQuestExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

export type InsertTemplateQuestRecord = Omit<TemplateQuestInsert, "questId">

/** テンプレートクエストを挿入する */
export const insertTemplateQuest = async ({db, record, questId}: {
  db: Db,
  record: InsertTemplateQuestRecord
  questId: string
}) => {
  try {
    // テンプレートクエストを挿入する
    const [newTemplateQuest] = await db.insert(templateQuests).values({
      ...record,
      questId,
    }).returning({ id: templateQuests.id })
    return {
      id: newTemplateQuest.id
    } 
  } catch (error) {
    devLog("insertTemplateQuest error:", error)
    throw new DatabaseError("テンプレートクエストの登録に失敗しました。")
  }
}

export type UpdateTemplateQuestRecord = Omit<TemplateQuestUpdate, "questId" | "familyQuestId">

/** テンプレートクエストを更新する */
export const updateTemplateQuest = async ({db, record, id, updatedAt}: {
  db: Db,
  record: UpdateTemplateQuestRecord
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeTemplateQuest = await templateQuestExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await templateQuestExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeTemplateQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // テンプレートクエストを更新する
    await db.update(templateQuests).set(record).where(eq(templateQuests.id, id))
    
  } catch (error) {
    devLog("updateTemplateQuest error:", error)
    throw new DatabaseError("テンプレートクエストの更新に失敗しました。")
  }
}

/** テンプレートクエストを削除する */
export const deleteTemplateQuest = async ({db, id, updatedAt}: {
  db: Db,
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeTemplateQuest = await templateQuestExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await templateQuestExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeTemplateQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // テンプレートクエストを削除する
    await db.delete(templateQuests).where(eq(templateQuests.id, id))
    
  } catch (error) {
    devLog("deleteTemplateQuest error:", error)
    throw new DatabaseError("テンプレートクエストの削除に失敗しました。")
  }
}
