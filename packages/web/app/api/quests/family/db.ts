import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { questExclusiveControl } from "./dbHelper"
import { FamilyQuestEntity, FamilyQuestEntityScheme } from "./entity"
import { devLog } from "@/app/(core)/util"
import { QuestEntity } from "../entity"
import { QuestTagEntity } from "@/app/(app)/quests/tag/entity"

/** クエストを挿入する */
export const insertFamilyQuest = async ({params, supabase}: {
  params: {
    _name: QuestEntity["name"],
    _family_id: FamilyQuestEntity["family_id"],
    _is_public: FamilyQuestEntity["is_public"],
    _type: QuestEntity["type"],
    _icon_id: QuestEntity["icon_id"],
    _icon_color: QuestEntity["icon_color"],
    _tags: QuestTagEntity["name"][],
    _category_id: QuestEntity["category_id"],
  }
  supabase: SupabaseClient
}) => {
  // レコードを挿入する
  const { data, error } = await supabase.rpc("insert_family_quest", params)
  
  // エラーをチェックする
  if (error) {
    devLog("insertFamilyQuest.SQL例外: ", error)
    devLog("insertFamilyQuest.パラメータ: ", params)
    throw new DatabaseError('クエストの作成に失敗しました。')
  }

  const questId = FamilyQuestEntityScheme.shape.quest_id.parse(data)

  return questId
}

/** クエストを更新する */
export const updateFamilyQuest = async ({params, updated_at, supabase}: {
  params: {
    _quest_id: QuestEntity["id"],
    _name: QuestEntity["name"],
    _is_public: FamilyQuestEntity["is_public"],
    _type: QuestEntity["type"],
    _icon_id: QuestEntity["icon_id"],
    _icon_color: QuestEntity["icon_color"],
    _tags: QuestTagEntity["name"][],
    _category_id: QuestEntity["category_id"]
  }
  updated_at: string,
  supabase: SupabaseClient
}) => {
  // 存在をチェックする
  const beforeQuest = await questExclusiveControl.existsCheck({id: params._quest_id, supabase})
  
  // 更新日時による排他制御を行う
  questExclusiveControl.hasAlreadyUpdated({
    beforeDate: beforeQuest.updated_at, 
    afterDate: updated_at
  })
  
  // クエストを更新する
  const {error} = await supabase.rpc('update_family_quest', params)

  // エラーをチェックする
  if (error) {
    devLog("updateFamilyQuest.SQL例外: ", error)
    devLog("updateFamilyQuest.パラメータ: ", params)
    throw new DatabaseError(`更新時にエラーが発生しました。`, )
  }
}

/** クエストを削除する */
export const deleteFamilyQuest = async ({supabase, params, updatedAt}: {
  params: {
    _quest_id: QuestEntity["id"]
  }
  updatedAt: QuestEntity["updated_at"],
  supabase: SupabaseClient, 
}) => {
  // 存在をチェックする
  const beforeQuest = await questExclusiveControl.existsCheck({id: params._quest_id, supabase})
  
  // 更新日時による排他制御を行う
  questExclusiveControl.hasAlreadyUpdated({
    beforeDate: beforeQuest.updated_at, 
    afterDate: updatedAt
  })
  
  const { error } = await supabase.rpc('delete_family_quest', params)

  // エラーをチェックする
  if (error) {
    devLog("deleteFamilyQuest.SQL例外: ", error)
    devLog("deleteFamilyQuest.パラメータ: ", params)
    throw new DatabaseError(`クエストの削除に失敗しました。`)
  }
}
