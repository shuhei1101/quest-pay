import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { deleteQuest, insertQuest, updateQuest } from "../db"
import { deletePublicQuest, insertPublicQuest, updatePublicQuest, UpdatePublicQuestRecord } from "./db"
import { deleteQuestTags, insertQuestTags, InsertQuestTagsRecord } from "../tag/db"
import { deleteQuestDetails, InsertQuestDetailRecord, insertQuestDetails } from "../detail/db"
import { FamilyQuestSelect, PublicQuestSelect, QuestSelect, QuestUpdate } from "@/drizzle/schema"
import { fetchFamilyQuest } from "../family/query"
import { fetchPublicQuest } from "./query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "../../users/query"
import { insertPublicTimeline } from "../../timeline/db"
import { PUBLIC_QUEST_VIEW_URL } from "@/app/(core)/endpoints"

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
        familyId: familyQuest.base.familyId,
        isActivate: false,
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


/** 公開クエストを編集する */
export const editPublicQuest = async ({db, quest, questDetails, publicQuest, questTags}: {
  db: Db
  quest: {
    record: QuestUpdate
    id: QuestSelect["id"]
    updatedAt: QuestSelect["updatedAt"]
  }
  questDetails: InsertQuestDetailRecord[]
  publicQuest: {
    record: Omit<UpdatePublicQuestRecord, "isActivate">
    id: PublicQuestSelect["id"]
    updatedAt: PublicQuestSelect["updatedAt"]
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

      // 公開クエストを更新する
      // await updatePublicQuest({db: tx,
      //   record: publicQuest.record,
      //   id: publicQuest.id, 
      //   updatedAt: publicQuest.updatedAt
      // })

      // タグを削除する
      await deleteQuestTags({db: tx, questId: quest.id})

      // タグを挿入する
      if (questTags.length > 0) await insertQuestTags({db: tx, records: questTags, questId: quest.id})
    })
  } catch (error) {
    devLog("editPublicQuest error:", error)
    throw new DatabaseError("公開クエストの更新に失敗しました。")
  }
}

/** クエストを削除する */
export const removePublicQuest = async ({db, publicQuest, quest}: {
  db: Db
  publicQuest: {
    id: PublicQuestSelect["id"]
    updatedAt: PublicQuestSelect["updatedAt"]
  }
  quest: {
    updatedAt: QuestSelect["updatedAt"]
  }
}) => {
  try {
    return await db.transaction(async (tx) => {
      // 公開クエストに紐づくクエストを取得する
      const currentPublicQuest = await fetchPublicQuest({ db: tx, id: publicQuest.id })

      // 公開クエストを削除する
      await deletePublicQuest({db: tx, id: publicQuest.id, updatedAt: publicQuest.updatedAt})

      // タグを削除する
      await deleteQuestTags({db: tx, questId: currentPublicQuest.quest.id})

      // 詳細を削除する
      await deleteQuestDetails({db: tx, questId: currentPublicQuest.quest.id})

      // クエストを削除する
      await deleteQuest({db: tx, id: currentPublicQuest.quest.id, updatedAt: quest.updatedAt})
    })

  } catch (error) {
    devLog("deletePublicQuest error:", error)
    throw new DatabaseError("公開クエストの削除に失敗しました。")
  }
}


/** 公開クエストを有効化する */
export const activatePublicQuest = async ({db, publicQuest}: {
  db: Db
  publicQuest: {
    id: PublicQuestSelect["id"]
    updatedAt: PublicQuestSelect["updatedAt"]
  }
}) => {
  try {
    return await db.transaction(async (tx) => {

      // 公開クエストを取得する
      const currentPublicQuest = await fetchPublicQuest({ db: tx, id: publicQuest.id })
      if (!currentPublicQuest) throw new DatabaseError("公開クエストの取得に失敗しました。")

      // 公開クエストを更新する
      await updatePublicQuest({db: tx,
        record: {
          isActivate: true
        },
        id: publicQuest.id, 
        updatedAt: publicQuest.updatedAt
      })

      // 公開タイムラインを登録する
      await insertPublicTimeline({
        db: tx,
        record: {
          familyId: currentPublicQuest.base.familyId,
          type: "quest_published",
          message: `新たなクエスト「${currentPublicQuest.quest.name}」を公開しました。`,
          url: `${PUBLIC_QUEST_VIEW_URL(currentPublicQuest.base.id)}`
        }
      })
    })
  } catch (error) {
    devLog("activatePublicQuest error:", error)
    throw new DatabaseError("公開クエストの有効化に失敗しました。")
  }
}
/** 公開クエストを無効化する */
export const deactivatePublicQuest = async ({db, publicQuest}: {
  db: Db
  publicQuest: {
    id: PublicQuestSelect["id"]
    updatedAt: PublicQuestSelect["updatedAt"]
  }
}) => {
  try {
    return await db.transaction(async (tx) => {

      // 公開クエストを更新する
      await updatePublicQuest({db: tx,
        record: {
          isActivate: false
        },
        id: publicQuest.id, 
        updatedAt: publicQuest.updatedAt
      })
    })
  } catch (error) {
    devLog("deactivatePublicQuest error:", error)
    throw new DatabaseError("公開クエストの無効化に失敗しました。")
  }
}

/** 公開クエストの編集権限を確認する */
export const hasPublicQuestPermission = async ({ publicQuestId }: {
  publicQuestId: PublicQuestSelect["id"]
}) => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    // 公開クエストを取得する
    const publicQuest = await fetchPublicQuest({ db, id: publicQuestId })
    // 家族IDが一致するか確認する
    return publicQuest?.base.familyId === userInfo.profiles.familyId
}
