import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { deleteQuest, insertQuest, updateQuest } from "../db"
import { deleteFamilyQuest, insertFamilyQuest, InsertFamilyQuestRecord, updateFamilyQuest, UpdateFamilyQuestRecord } from "./db"
import { deleteQuestChildren, insertQuestChildren, InsertQuestChildrenRecord } from "../child/db"
import { deleteQuestTags, insertQuestTags, InsertQuestTagsRecord } from "../tag/db"
import { deleteQuestDetails, InsertQuestDetailRecord, insertQuestDetails } from "../detail/db"
import { FamilyQuestSelect, FamilyQuestUpdate, QuestInsert, QuestSelect, QuestUpdate } from "@/drizzle/schema"
import { fetchFamilyQuest } from "./query"

/** 家族クエストを登録する */
export const registerFamilyQuest = async ({db, quests, questDetails, familyQuest, questChildren, questTags}: {
  db: Db
  quests: Omit<QuestInsert, "type">
  questDetails: InsertQuestDetailRecord[]
  questChildren: Omit<InsertQuestChildrenRecord, "familyQuestId">[]
  questTags: Omit<InsertQuestTagsRecord, "questId">[]
  familyQuest: InsertFamilyQuestRecord
}) => {
  try {
    return await db.transaction(async (tx) => {
      // クエストを挿入する
      const { id: questId } = await insertQuest({db: tx, record: {
          type: "family",
          ...quests,
        }
      })

      // 詳細を挿入する
      if (questDetails.length > 0) await insertQuestDetails({db: tx, records: questDetails, questId})

      // 家族クエストを挿入する
      const { id: familyQuestId } = await insertFamilyQuest({db: tx, record: familyQuest, questId })

      // クエスト対象の子供を挿入する
      if (questChildren.length > 0) await insertQuestChildren({db: tx, records: questChildren, familyQuestId})
      
      // タグを挿入する
      if (questTags.length > 0) await insertQuestTags({db: tx, records: questTags, questId})

      return questId
    })
  } catch (error) {
    devLog("registerFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの登録に失敗しました。")
  }
}

/** 家族クエストを編集する */
export const editFamilyQuest = async ({db, quest, questDetails, familyQuest, questChildren, questTags}: {
  db: Db
  quest: {
    record: QuestUpdate
    id: QuestSelect["id"]
    updatedAt: QuestSelect["updatedAt"]
  }
  questDetails: InsertQuestDetailRecord[]
  familyQuest: {
    record: UpdateFamilyQuestRecord
    id: FamilyQuestSelect["id"]
    updatedAt: FamilyQuestSelect["updatedAt"]
  }
  questChildren: InsertQuestChildrenRecord[]
  questTags: InsertQuestTagsRecord[]
}) => {
  try {
    return await db.transaction(async (tx) => {
      // クエストを更新する
      await updateQuest({db: tx, 
        record: quest.record, 
        id: quest.id, 
        updatedAt: quest.updatedAt
      })

      // 詳細を削除する
      await deleteQuestDetails({db: tx, questId: quest.id})

      // 詳細を挿入する
      if (questDetails.length > 0) await insertQuestDetails({db: tx, records: questDetails, questId: quest.id})

      // 家族クエストを更新する
      await updateFamilyQuest({db: tx, 
        record: familyQuest.record, 
        id: familyQuest.id, 
        updatedAt: familyQuest.updatedAt
      })

      // クエスト対象の子供を削除する
      await deleteQuestChildren({db: tx, familyQuestId: familyQuest.id})

      // クエスト対象の子供を挿入する
      if (questChildren.length > 0) await insertQuestChildren({db: tx, records: questChildren, familyQuestId: familyQuest.id})
      
      // タグを削除する
      await deleteQuestTags({db: tx, questId: quest.id})

      // タグを挿入する
      if (questTags.length > 0) await insertQuestTags({db: tx, records: questTags, questId: quest.id})
    })
  } catch (error) {
    devLog("registerFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの更新に失敗しました。")
  }
}

/** クエストを削除する */
export const removeFamilyQuest = async ({db, familyQuest, quest}: {
  db: Db
  familyQuest: {
    id: FamilyQuestSelect["id"]
    updatedAt: FamilyQuestSelect["updatedAt"]
  }
  quest: {
    updatedAt: QuestSelect["updatedAt"]
  }
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 家族クエストに紐づくクエストを取得する
      const currentFamilyQuest = await fetchFamilyQuest({ db: tx, id: familyQuest.id })

      // 家族クエストを削除する
      await deleteFamilyQuest({db: tx, id: familyQuest.id, updatedAt: familyQuest.updatedAt})

      // タグを削除する
      await deleteQuestTags({db: tx, questId: currentFamilyQuest.quest.id})

      // クエスト対象の子供を削除する
      await deleteQuestChildren({db: tx, familyQuestId: familyQuest.id})

      // 詳細を削除する
      await deleteQuestDetails({db: tx, questId: currentFamilyQuest.quest.id})

      // クエストを削除する
      await deleteQuest({db: tx, id: currentFamilyQuest.quest.id, updatedAt: quest.updatedAt})
    })

  } catch (error) {
    devLog("deleteFamilyQuest error:", error)
    throw new DatabaseError("家族クエストの削除に失敗しました。")
  }
}
