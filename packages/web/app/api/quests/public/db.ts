import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { PublicQuestInsert, publicQuests, PublicQuestUpdate, questDetails, quests } from "@/drizzle/schema"
import { Db } from "@/index"
import { publicQuestExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

export type InsertPublicQuestRecord = Omit<PublicQuestInsert, "questId">

/** 公開クエストを挿入する */
export const insertPublicQuest = async ({db, record, questId}: {
  db: Db,
  record: InsertPublicQuestRecord
  questId: string
}) => {
  try {
    // 公開クエストを挿入する
    const [newPublicQuest] = await db.insert(publicQuests).values({
      ...record,
      questId,
    }).returning({ id: publicQuests.id })
    return {
      id: newPublicQuest.id
    } 
  } catch (error) {
    devLog("insertPublicQuest error:", error)
    throw new DatabaseError("公開クエストの登録に失敗しました。")
  }
}

export type UpdatePublicQuestRecord = Omit<PublicQuestUpdate, "questId" | "familyQuestId">

/** 公開クエストを更新する */
export const updatePublicQuest = async ({db, record, id, updatedAt}: {
  db: Db,
  record: UpdatePublicQuestRecord
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforePublicQuest = await publicQuestExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await publicQuestExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforePublicQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // 公開クエストを更新する
    await db.update(publicQuests).set(record).where(eq(publicQuests.id, id))
    
  } catch (error) {
    devLog("updatePublicQuest error:", error)
    throw new DatabaseError("公開クエストの更新に失敗しました。")
  }
}

/** 公開クエストを削除する */
export const deletePublicQuest = async ({db, id, updatedAt}: {
  db: Db,
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforePublicQuest = await publicQuestExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await publicQuestExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforePublicQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // 公開クエストを削除する
    await db.delete(publicQuests).where(eq(publicQuests.id, id))
    
  } catch (error) {
    devLog("deletePublicQuest error:", error)
    throw new DatabaseError("公開クエストの削除に失敗しました。")
  }
}
