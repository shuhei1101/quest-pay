import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { FamilyQuestInsert, familyQuests, FamilyQuestUpdate, questDetails, quests } from "@/drizzle/schema"
import { Db } from "@/index"
import { familyQuestExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

export type InsertFamilyQuestRecord = Omit<FamilyQuestInsert, "questId">

/** 家族クエストを挿入する */
export const insertFamilyQuest = async ({db, record, questId}: {
  db: Db,
  record: InsertFamilyQuestRecord
  questId: string
}) => {
  try {
    // 家族クエストを挿入する
    const [newFamilyQuest] = await db.insert(familyQuests).values({
      ...record,
      questId,
    }).returning({ id: familyQuests.id })
    return {
      id: newFamilyQuest.id
    } 
  } catch (error) {
    devLog("insertFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの登録に失敗しました。")
  }
}

export type UpdateFamilyQuestRecord = Omit<FamilyQuestUpdate, "questId">

/** 家族クエストを更新する */
export const updateFamilyQuest = async ({db, record, id, updatedAt}: {
  db: Db,
  record: UpdateFamilyQuestRecord
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeFamilyQuest = await familyQuestExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await familyQuestExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeFamilyQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // 家族クエストを更新する
    await db.update(familyQuests).set(record).where(eq(familyQuests.id, id))
    
  } catch (error) {
    devLog("updateFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの更新に失敗しました。")
  }
}

/** 家族クエストを削除する */
export const deleteFamilyQuest = async ({db, id, updatedAt}: {
  db: Db,
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeFamilyQuest = await familyQuestExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await familyQuestExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeFamilyQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // 家族クエストを削除する
    await db.delete(familyQuests).where(eq(familyQuests.id, id))
    
  } catch (error) {
    devLog("deleteFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの削除に失敗しました。")
  }
}
