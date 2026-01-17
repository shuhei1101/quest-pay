import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { FamilyQuestSelect, questChildren, QuestChildrenInsert, QuestChildrenSelect, QuestChildrenUpdate, QuestSelect } from "@/drizzle/schema"
import { Db } from "@/index"
import { and, eq } from "drizzle-orm"
import { questChildExclusiveControl } from "./dbHelper"

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
    devLog("insertQuestChildren records:", records)
    throw new DatabaseError("クエスト対象の子供の登録に失敗しました。")
  }
}

/** クエスト対象の子供のステータスを更新する */
export const updateQuestChild = async ({db, familyQuestId, updatedAt, record, childId}: {
  db: Db,
  record: QuestChildrenUpdate,
  childId: QuestChildrenSelect["childId"],
  familyQuestId: QuestChildrenSelect["familyQuestId"],
  updatedAt: QuestChildrenSelect["updatedAt"]
}) => {
  try {
    // 存在チェックを行う
    const beforeFamilyQuest = await questChildExclusiveControl.existsCheck({familyQuestId, db, childId})

    // 更新日による排他チェックを行う
    await questChildExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeFamilyQuest.base.updatedAt,
      afterDate: updatedAt,
    })

    // 子供クエストを更新する
    await db.update(questChildren).set(record).where(and(
      eq(questChildren.familyQuestId, familyQuestId),
      eq(questChildren.childId, childId)
    ))
    
  } catch (error) {
    devLog("updateQuestChild error:", error)
    throw new DatabaseError("クエスト対象の子供の更新に失敗しました。")
  }
}

/** クエスト対象の子供の設定を更新する（排他制御なし） */
export const updateQuestChildSettings = async ({db, familyQuestId, record, childId}: {
  db: Db,
  record: QuestChildrenUpdate,
  childId: QuestChildrenSelect["childId"],
  familyQuestId: QuestChildrenSelect["familyQuestId"],
}) => {
  try {
    // 子供クエストを更新する
    await db.update(questChildren).set(record).where(and(
      eq(questChildren.familyQuestId, familyQuestId),
      eq(questChildren.childId, childId)
    ))
    
  } catch (error) {
    devLog("updateQuestChildSettings error:", error)
    throw new DatabaseError("クエスト対象の子供の設定更新に失敗しました。")
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

/** 特定の子供をクエストから削除する */
export const deleteQuestChild = async ({db, familyQuestId, childId}: {
  db: Db,
  familyQuestId: FamilyQuestSelect["id"],
  childId: QuestChildrenSelect["childId"]
}) => {
  try {
    // 特定の子供を削除する
    await db.delete(questChildren).where(and(
      eq(questChildren.familyQuestId, familyQuestId),
      eq(questChildren.childId, childId)
    )).execute()
  } catch (error) {
    devLog("deleteQuestChild error:", error)
    throw new DatabaseError("クエスト対象の子供の削除に失敗しました。")
  }
}
