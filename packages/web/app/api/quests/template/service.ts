import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { deleteQuest, insertQuest, updateQuest } from "../db"
import { deleteTemplateQuest, insertTemplateQuest, updateTemplateQuest, UpdateTemplateQuestRecord } from "./db"
import { deleteQuestTags, insertQuestTags, InsertQuestTagsRecord } from "../tag/db"
import { deleteQuestDetails, InsertQuestDetailRecord, insertQuestDetails } from "../detail/db"
import { FamilyQuestSelect, TemplateQuestSelect, QuestSelect, QuestUpdate, FamilySelect } from "@/drizzle/schema"
import { fetchTemplateQuest } from "./query"
import { fetchPublicQuest } from "../public/query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "../../users/query"

/** 公開クエストからテンプレート登録を行う */
export const registerTemplateQuestByPublicQuest = async ({
  db, 
  publicQuestId,
  familyId
}: {
  db: Db
  publicQuestId: FamilyQuestSelect["id"]
  familyId: FamilySelect["id"]
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 公開クエストを取得する
      const publicQuest = await fetchPublicQuest({db: tx, id: publicQuestId})
      if (!publicQuest) throw new DatabaseError("公開クエストの取得に失敗しました。")

      // 挿入用公開クエスト
      const { id, createdAt, updatedAt, type, ...insertPublicQuest } = publicQuest.quest

      // クエストを挿入する
      const { id: questId } = await insertQuest({db: tx, record: {
        type: "template",
        ...insertPublicQuest,
      }})

      // 詳細を挿入する
      if (publicQuest.details.length > 0) await insertQuestDetails({db: tx, records: publicQuest.details.map(({id, createdAt, updatedAt, ...rest}) => rest), questId})

      // 公開クエストを挿入する
      const { id: templateQuestId } = await insertTemplateQuest({db: tx, record: {
        familyId,
        publicQuestId: publicQuest.base.id
      }, questId })

      // タグを挿入する
      if (publicQuest.tags.length > 0) await insertQuestTags({db: tx, records: publicQuest.tags.map(({id, createdAt, updatedAt, ...rest}) => rest), questId})

      return questId
    })
  } catch (error) {
    devLog("registerTemplateQuestByFamilyQuest error:", error)
    throw new DatabaseError("テンプレートクエストの登録に失敗しました。")
  }
}


/** テンプレートクエストを編集する */
export const editTemplateQuest = async ({db, quest, questDetails, templateQuest, questTags}: {
  db: Db
  quest: {
    record: QuestUpdate
    id: QuestSelect["id"]
    updatedAt: QuestSelect["updatedAt"]
  }
  questDetails: InsertQuestDetailRecord[]
  templateQuest: {
    record: UpdateTemplateQuestRecord
    id: TemplateQuestSelect["id"]
    updatedAt: TemplateQuestSelect["updatedAt"]
  }
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

      // テンプレートクエストを更新する
      // 現状テンプレートクエスト側に更新項目がないためコメントアウト
      // await updateTemplateQuest({db: tx,
      //   record: templateQuest.record,
      //   id: templateQuest.id, 
      //   updatedAt: templateQuest.updatedAt
      // })

      // タグを削除する
      await deleteQuestTags({db: tx, questId: quest.id})

      // タグを挿入する
      if (questTags.length > 0) await insertQuestTags({db: tx, records: questTags, questId: quest.id})
    })
  } catch (error) {
    devLog("editTemplateQuest error:", error)
    throw new DatabaseError("テンプレートクエストの更新に失敗しました。")
  }
}

/** クエストを削除する */
export const removeTemplateQuest = async ({db, templateQuest, quest}: {
  db: Db
  templateQuest: {
    id: TemplateQuestSelect["id"]
    updatedAt: TemplateQuestSelect["updatedAt"]
  }
  quest: {
    updatedAt: QuestSelect["updatedAt"]
  }
}) => {
  try {
    return await db.transaction(async (tx) => {
      // テンプレートクエストIDに紐づくクエストを取得する
      const currentTemplateQuest = await fetchTemplateQuest({ db: tx, id: templateQuest.id })

      // テンプレートクエストを削除する
      await deleteTemplateQuest({db: tx, id: templateQuest.id, updatedAt: templateQuest.updatedAt})

      // タグを削除する
      await deleteQuestTags({db: tx, questId: currentTemplateQuest.quest.id})

      // 詳細を削除する
      await deleteQuestDetails({db: tx, questId: currentTemplateQuest.quest.id})

      // クエストを削除する
      await deleteQuest({db: tx, id: currentTemplateQuest.quest.id, updatedAt: quest.updatedAt})
    })

  } catch (error) {
    devLog("deleteTemplateQuest error:", error)
    throw new DatabaseError("テンプレートクエストの削除に失敗しました。")
  }
}

/** テンプレートクエストの編集権限を確認する */
export const hasTemplateQuestPermission = async ({ templateQuestId }: {
  templateQuestId: TemplateQuestSelect["id"]
}) => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    // テンプレートクエストを取得する
    const templateQuest = await fetchTemplateQuest({ db, id: templateQuestId })
    // 家族IDが一致するか確認する
    return templateQuest?.base.familyId === userInfo.profiles.familyId
}
