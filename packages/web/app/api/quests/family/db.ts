import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { FamilyQuestInsert, familyQuests, FamilyQuestUpdate, questDetails, quests } from "@/drizzle/schema"
import { Db } from "@/index"
import { familyQuestExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

export type InsertFamilyQuestRecord = Omit<FamilyQuestInsert, "id" | "createdAt" | "updatedAt">

/** 家族クエストを挿入する */
export const insertFamilyQuest = async ({db, record}: {
  db: Db,
  record: InsertFamilyQuestRecord
}) => {
  try {
    // 家族クエストを挿入する
    const [newFamilyQuest] = await db.insert(familyQuests).values(record).returning({ id: familyQuests.id })
    return {
      id: newFamilyQuest.id
    } 
  } catch (error) {
    devLog("insertFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの登録に失敗しました。")
  }
}

/** 家族クエストを更新する */
export type UpdateFamilyQuestRecord = Partial<Omit<FamilyQuestUpdate, "createdAt">>
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
      beforeDate: beforeFamilyQuest.updatedAt,
      afterDate: updatedAt,
    })

    // 家族クエストを更新する
    await db.update(quests).set(record).where(eq(quests.id, id))
    
  } catch (error) {
    devLog("updateFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの更新に失敗しました。")
  }
}
