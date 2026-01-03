import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { insertQuest } from "../db"
import { insertPublicQuest } from "./db"
import { insertQuestTags } from "../tag/db"
import { insertQuestDetails } from "../detail/db"
import { FamilyQuestSelect } from "@/drizzle/schema"
import { fetchFamilyQuest } from "../family/query"

/** 家族クエストから公開クエストを登録する */
export const registerPublicQuestByFamilyQuest = async ({
  db, 
  familyQuestId
}: {
  db: Db
  familyQuestId: FamilyQuestSelect["id"]
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 家族クエストを取得する
      const familyQuest = await fetchFamilyQuest({db: tx, id: familyQuestId})
      if (!familyQuest) throw new DatabaseError("家族クエストの取得に失敗しました。")
      
      // 挿入用家族クエスト
      const { id, createdAt, updatedAt, type, ...insertFamilyQuest } = familyQuest.quest

      // クエストを挿入する
      const { id: questId } = await insertQuest({db: tx, record: {
        type: "public",
        ...insertFamilyQuest,
      }})

      // 詳細を挿入する
      if (familyQuest.details.length > 0) await insertQuestDetails({db: tx, records: familyQuest.details.map(({id, createdAt, updatedAt, ...rest}) => rest), questId})

      // 公開クエストを挿入する
      const { id: publicQuestId } = await insertPublicQuest({db: tx, record: {
        familyQuestId: familyQuest.base.id,
        isShared: false,
      }, questId })

      // タグを挿入する
      if (familyQuest.tags.length > 0) await insertQuestTags({db: tx, records: familyQuest.tags.map(({id, createdAt, updatedAt, ...rest}) => rest), questId})

      return questId
    })
  } catch (error) {
    devLog("registerPublicQuestByFamilyQuest error:", error)
    throw new DatabaseError("公開クエストの登録に失敗しました。")
  }
}
