import { DatabaseError, ServerError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { Db } from "@/index"
import { deleteQuest, insertQuest, updateQuest } from "../db"
import { deleteFamilyQuest, insertFamilyQuest, InsertFamilyQuestRecord, updateFamilyQuest, UpdateFamilyQuestRecord } from "./db"
import { deleteQuestChildren, insertQuestChildren, InsertQuestChildrenRecord, updateQuestChild } from "./[id]/child/db"
import { deleteQuestTags, insertQuestTags, InsertQuestTagsRecord } from "../tag/db"
import { deleteQuestDetails, InsertQuestDetailRecord, insertQuestDetails } from "../detail/db"
import { ChildSelect, FamilyQuestSelect, FamilyQuestUpdate, FamilySelect, ProfileSelect, QuestChildrenSelect, QuestChildrenUpdate, QuestDetailSelect, QuestInsert, QuestSelect, QuestUpdate } from "@/drizzle/schema"
import { fetchFamilyQuest } from "./query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "../../users/query"
import { fetchFamilyParents } from "../../parents/query"
import { insertNotification } from "../../notifications/db"
import { fetchChild } from "../../children/query"
import { CHILD_QUEST_VIEW_URL } from "@/app/(core)/endpoints"
import { fetchChildQuest } from "./[id]/child/query"
import { updateChild } from "../../children/db"

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
      if (questChildren.length > 0) await insertQuestChildren({db: tx, records: questChildren.map(child => ({
        ...child,
        status: "in_progress"
      })), familyQuestId})
      
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

/** 家族クエストの編集権限を確認する */
export const hasFamilyQuestPermission = async ({ familyQuestId }: {
  familyQuestId: FamilyQuestSelect["id"]
}) => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    // 家族クエストを取得する
    const familyQuest = await fetchFamilyQuest({ db, id: familyQuestId })

    // 家族IDが一致するかどうか
    return userInfo.profiles.familyId === familyQuest?.base?.familyId
}
/** 子供クエストの編集権限を確認する */
export const hasChildQuestPermission = async ({ familyQuestId, childId }: {
  familyQuestId: FamilyQuestSelect["id"]
  childId: ChildSelect["id"]
}) => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    // 家族クエストを取得する
    const familyQuest = await fetchFamilyQuest({ db, id: familyQuestId })

    // 子供情報を取得する
    const child = await fetchChild({ db, childId })

    if (userInfo.profiles.type === "parent") {
      // 親ユーザかつ子供が所属する家族IDと親ユーザの家族IDが一致するかどうか
      return child?.profiles?.familyId === userInfo.profiles.familyId
    } else {
      // 子供ユーザかつログインユーザの子供IDとアクセスしている子供IDが一致するかどうか
      return userInfo?.children?.id === childId
    }
}


/** 家族クエストを完了報告する */
export const reviewRequest = async ({db, familyQuestId, updatedAt, childId, requestMessage, familyId}: {
  db: Db
  familyQuestId: FamilyQuestSelect["id"]
  updatedAt: QuestChildrenSelect["updatedAt"]
  childId: ChildSelect["id"]
  familyId: FamilySelect["id"]
  requestMessage?: string
}) => {
  try {
    return await db.transaction(async (tx) => {

      // 家族クエストを取得する
      const currentFamilyQuest = await fetchFamilyQuest({ db: tx, id: familyQuestId })
      if (!currentFamilyQuest) throw new DatabaseError("家族クエストが見つかりません。")

      // クエスト対象の子供のステータスを完了に更新する
      await updateQuestChild({db: tx,
        record: {
          status: "pending_review",
          requestMessage,
        },
        familyQuestId: familyQuestId,
        childId,
        updatedAt
      })

      // 家族の親を取得する
      const familyParents = await fetchFamilyParents({ db: tx, familyId })

      // 子供のプロフィールを取得する
      const child = await fetchChild({ db: tx, childId })
      
      // 対象親の通知を登録する
      for (const parent of familyParents) {
        if (!parent.profiles?.id) break

        await insertNotification({
          db: tx,
          record: {
            type: "family_quest_review",
            message: `${child.profiles?.name}から${currentFamilyQuest.quest.name}の完了報告がありました。`,
            recipientProfileId: parent.profiles.id,
            url: `${CHILD_QUEST_VIEW_URL(currentFamilyQuest.base.id, child.children.id)}`,
          },
        })
      }
    })
  } catch (error) {
    devLog("reviewRequest error:", error)
    throw new DatabaseError("家族クエストの完了報告に失敗しました。")
  }
}

/** 家族クエストの完了報告をキャンセルする */
export const cancelReview = async ({db, familyQuestId, updatedAt, childId, requestMessage, familyId}: {
  db: Db
  familyQuestId: FamilyQuestSelect["id"]
  updatedAt: QuestChildrenSelect["updatedAt"]
  childId: ChildSelect["id"]
  requestMessage?: string
  familyId: FamilySelect["id"]
}) => {
  try {
    return await db.transaction(async (tx) => {

      // 家族クエストを取得する
      const currentFamilyQuest = await fetchFamilyQuest({ db: tx, id: familyQuestId })
      if (!currentFamilyQuest) throw new DatabaseError("家族クエストが見つかりません。")

      // クエスト対象の子供のステータスを進行中に戻す
      await updateQuestChild({db: tx,
        record: {
          status: "in_progress",
          requestMessage: requestMessage || "",
        },
        familyQuestId: familyQuestId,
        childId,
        updatedAt
      })
      // 家族の親を取得する
      const familyParents = await fetchFamilyParents({ db: tx, familyId })

      // 子供のプロフィールを取得する
      const child = await fetchChild({ db: tx, childId })
      
      // 対象親の通知を登録する
      for (const parent of familyParents) {
        if (!parent.profiles?.id) break

        await insertNotification({
          db: tx,
          record: {
            type: "family_quest_review",
            message: `${child.profiles?.name}から${currentFamilyQuest.quest.name}の完了報告がありました。`,
            recipientProfileId: parent.profiles.id,
            url: `${CHILD_QUEST_VIEW_URL(currentFamilyQuest.base.id, child.children.id)}`,
          },
        })
      }
    })
  } catch (error) {
    devLog("cancelReview error:", error)
    throw new DatabaseError("家族クエストの完了報告キャンセルに失敗しました。")
  }
}

/** 報告を却下する */
export const rejectReport = async ({db, familyQuestId, childId, responseMessage, profileId, updatedAt}: {
  db: Db
  familyQuestId: FamilyQuestSelect["id"]
  childId: ChildSelect["id"]
  responseMessage?: string
  profileId: ProfileSelect["id"]
  updatedAt: QuestChildrenSelect["updatedAt"]
}) => {
  try {
    return await db.transaction(async (tx) => {
      // クエスト子供を取得する
      const questChild = await fetchChildQuest({ db: tx, familyQuestId, childId })
      if (!questChild) throw new DatabaseError("クエストが見つかりません。")

      // クエスト対象の子供のステータスを進行中に戻す
      await updateQuestChild({
        db: tx,
        record: {
          status: "in_progress",
          lastApprovedBy: profileId,
        },
        familyQuestId: questChild.children[0].familyQuestId,
        childId: questChild.children[0].childId,
        updatedAt
      })

      // 子供情報を取得する
      const child = await fetchChild({ db: tx, childId: questChild.children[0].childId })
      if (!child?.profiles?.id) throw new DatabaseError("子供のプロフィールIDが取得できません。")

      // 子供に通知を送信する
      await insertNotification({
        db: tx,
        record: {
          type: "quest_report_rejected",
          message: `「${questChild.quest.name}」の報告が却下されました${responseMessage ? `。${responseMessage}` : ''}`,
          recipientProfileId: child.profiles.id,
          url: `${CHILD_QUEST_VIEW_URL(questChild.base.id, questChild.children[0].childId)}`,
        },
      })
    })
  } catch (error) {
    devLog("rejectReport error:", error)
    throw new DatabaseError("報告の却下に失敗しました。")
  }
}

/** 報告を受領する */
export const approveReport = async ({db, familyQuestId, childId, responseMessage, profileId, updatedAt}: {
  db: Db
  familyQuestId: FamilyQuestSelect["id"]
  childId: ChildSelect["id"]
  responseMessage?: string
  profileId: ProfileSelect["id"]
  updatedAt: QuestChildrenSelect["updatedAt"]
}) => {
  try {
    return await db.transaction(async (tx) => {
      // クエスト子供を取得する
      const questChild = await fetchChildQuest({ db: tx, familyQuestId, childId })
      if (!questChild) throw new DatabaseError("クエストが見つかりません。")

      const currentQuestChild = questChild.children[0]
      const currentLevel = currentQuestChild.level
      
      // 子供情報を取得する
      const child = await fetchChild({ db: tx, childId })
      if (!child?.profiles?.id) throw new DatabaseError("子供のプロフィールIDが取得できません。")
      
      // 現在のレベルの詳細を取得する
      const currentDetail = questChild.details.find((d: QuestDetailSelect) => d.level === currentLevel)
      if (!currentDetail) throw new DatabaseError("クエスト詳細が見つかりません。")

      // 次の達成回数とクリア回数を計算する
      const nextCompletionCount = currentQuestChild.currentCompletionCount + 1
      const isCompletionAchieved = nextCompletionCount >= currentDetail.requiredCompletionCount
      const nextClearCount = currentQuestChild.currentClearCount + (isCompletionAchieved ? 1 : 0)
      const isClearAchieved = nextClearCount >= currentDetail.requiredClearCount
      const nextLevel = currentLevel + 1
      const isLevelUpPossible = nextLevel <= 5

      let notificationType: "quest_report_approved" | "quest_cleared" | "quest_level_up" | "quest_completed" = "quest_report_approved"
      let notificationMessage = `「${questChild.quest.name}」の報告を受領しました`
      let questChildUpdate: QuestChildrenUpdate = {
        status: "in_progress",
        lastApprovedBy: profileId,
      }

      // 達成回数到達の場合
      if (isCompletionAchieved) {
        // クリア到達の場合
        if (isClearAchieved) {
          // レベルアップ可能な場合
          if (isLevelUpPossible) {
            // レベルアップ
            questChildUpdate = {
              ...questChildUpdate,
              level: nextLevel,
              currentClearCount: 0,
              currentCompletionCount: 0,
            }
            notificationType = "quest_level_up"
            notificationMessage = `「${questChild.quest.name}」がレベル${nextLevel}に上がりました！報酬:${currentDetail.reward}円、経験値:${currentDetail.childExp}`
          } else {
            // クエスト完了
            questChildUpdate = {
              ...questChildUpdate,
              status: "completed",
            }
            notificationType = "quest_completed"
            notificationMessage = `「${questChild.quest.name}」を完全クリアしました！お疲れ様でした！報酬:${currentDetail.reward}円、経験値:${currentDetail.childExp}`
          }
          
          // 報酬と経験値を付与する
          await updateChild({
            db: tx,
            id: currentQuestChild.childId,
            updatedAt: child.children.updatedAt,
            record: {
              currentSavings: (child.children.currentSavings || 0) + currentDetail.reward,
              totalExp: (child.children.totalExp || 0) + currentDetail.childExp,
              // TODO: 子供レベルの計算（保留）
            },
          })
        } else {
          // クリアしたが次のレベルまではいかない
          questChildUpdate = {
            ...questChildUpdate,
            currentClearCount: nextClearCount,
            currentCompletionCount: 0,
          }
          notificationType = "quest_cleared"
          notificationMessage = `「${questChild.quest.name}」をクリアしました！報酬:${currentDetail.reward}円、経験値:${currentDetail.childExp}`
          
          // 報酬と経験値を付与する
          await updateChild({
            db: tx,
            id: currentQuestChild.childId,
            updatedAt: child.children.updatedAt,
            record: {
              currentSavings: (child.children.currentSavings || 0) + currentDetail.reward,
              totalExp: (child.children.totalExp || 0) + currentDetail.childExp,
              // TODO: 子供レベルの計算（保留）
            },
          })
        }
      } else {
        // 達成回数が足りない場合
        questChildUpdate = {
          ...questChildUpdate,
          currentCompletionCount: nextCompletionCount,
        }
      }

      // クエスト対象の子供を更新する
      await updateQuestChild({
        db: tx,
        record: questChildUpdate,
        familyQuestId: currentQuestChild.familyQuestId,
        childId: currentQuestChild.childId,
        updatedAt
      })

      // 子供に通知を送信する
      await insertNotification({
        db: tx,
        record: {
          type: notificationType,
          message: notificationMessage,
          recipientProfileId: child.profiles.id,
          url: `${CHILD_QUEST_VIEW_URL(questChild.base.id, currentQuestChild.childId)}`,
        },
      })
    })
  } catch (error) {
    devLog("approveReport error:", error)
    throw new DatabaseError("報告の受領に失敗しました。")
  }
}
