import { DatabaseError } from "@/app/(core)/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { QuestDelete, QuestInsert, QuestUpdate } from "@/app/api/quests/entity"
import { questExclusiveControl } from "./dbHelper"
import { QuestTagUpdate } from "@/app/(app)/quests/tag/entity"
import { FamilyQuestInsert, FamilyQuestUpdate } from "./entity"
import { z } from "zod"
import { devLog } from "@/app/(core)/util"

/** クエストを挿入する */
export const insertFamilyQuest = async ({quest, familyQuest, tags, supabase}: {
  quest: QuestInsert,
  familyQuest: FamilyQuestInsert
  tags: QuestTagUpdate[],
  supabase: SupabaseClient
}) => {
  // レコードを挿入する
  const { data, error } = await supabase.rpc("insert_family_quest", {
    _name: quest.name,
    _family_id: familyQuest.family_id,
    _is_public: familyQuest.is_public,
    _type: quest.type,
    _icon_id: quest.icon_id,
    _icon_color: quest.icon_color,
    _tags: tags.map(t => t.name),
    _category_id: quest.category_id
  })
  
  // エラーをチェックする
  if (error) {
    console.log(error)
    throw new DatabaseError('クエストの作成に失敗しました。')
  }

  const questId = z.number().parse(data)

  return questId
}

/** クエストを更新する */
export const updateFamilyQuest = async ({quest, familyQuest, tags, supabase}: {
  quest: QuestUpdate,
  familyQuest: FamilyQuestUpdate
  tags: QuestTagUpdate[],
  supabase: SupabaseClient
}) => {
  // 存在をチェックする
  const beforeQuest = await questExclusiveControl.existsCheck({id: quest.id, supabase})
  
  // 更新日時による排他制御を行う
  questExclusiveControl.hasAlreadyUpdated({
    beforeDate: beforeQuest.updated_at, 
    afterDate: quest.updated_at
  })
  
  // クエストを更新する
  const {error} = await supabase.rpc('update_family_quest', {
    _quest_id: quest.id,
    _name: quest.name,
    _is_public: familyQuest.is_public,
    _type: quest.type,
    _icon_id: quest.icon_id,
    _icon_color: quest.icon_color,
    _tags: tags.map(t => t.name),
    _category_id: quest.category_id
  })

  // エラーをチェックする
  if (error) {
    devLog("家族クエスト更新エラー: ", error)
    devLog("更新データ: ", {quest, familyQuest, tags, supabase})
    throw new DatabaseError(`更新時にエラーが発生しました。`)
  }
}

/** クエストを削除する */
export const deleteFamilyQuest = async ({supabase, quest}: {
  supabase: SupabaseClient, 
  quest: QuestDelete
}) => {
  // 存在をチェックする
  const beforeQuest = await questExclusiveControl.existsCheck({id: quest.id, supabase})
  
  // 更新日時による排他制御を行う
  questExclusiveControl.hasAlreadyUpdated({
    beforeDate: beforeQuest.updated_at, 
    afterDate: quest.updated_at
  })
  
  const { error } = await supabase.rpc('delete_family_quest', {
    _quest_id: quest.id
  })

  // エラーをチェックする
  if (error) {
    console.log(error)
    throw new DatabaseError(`クエストの削除に失敗しました。`)
  }
}
