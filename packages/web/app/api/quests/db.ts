import { DatabaseError } from "@/app/(core)/appError"
import { QuestInsert } from "./entity"
import { SupabaseClient } from "@supabase/supabase-js"
import { QuestTagUpdate } from "../../(app)/quests/_schema/questTagEntity"
import { QuestDelete, QuestUpdate } from "@/app/api/quests/entity"
import { questExclusiveControl } from "./dbHelper"

/** クエストを挿入する */
export const insertQuest = async ({quest, tags, supabase}: {
  quest: QuestInsert,
  tags: QuestTagUpdate[],
  supabase: SupabaseClient
}) => {
  // レコードを挿入する
  const { error } = await supabase.rpc("insert_quest", {
    _name: quest.name,
    _type: quest.type,
    _icon: quest.icon,
    _tags: tags.map(t => t.name)
  })
  
  // エラーをチェックする
  if (error) {
    console.log(error)
    throw new DatabaseError('クエストの作成に失敗しました。')
  }
}

/** クエストを更新する */
export const updateQuest = async ({quest, tags, supabase}: {
  quest: QuestUpdate,
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
  const {error} = await supabase.rpc('update_quest', {
    _quest_id: quest.id,
    _name: quest.name,
    _type: quest.type,
    _icon: quest.icon,
    _tags: tags.map(t => t.name)
  })

  // エラーをチェックする
  if (error) {
    console.log(error)
    throw new DatabaseError(`更新時にエラーが発生しました。`)
  }
}

/** クエストを削除する */
export const deleteQuest = async ({supabase, quest}: {
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
  
  const { error } = await supabase.rpc('delete_quest', {
    _quest_id: quest.id
  })

  // エラーをチェックする
  if (error) {
    console.log(error)
    throw new DatabaseError(`クエストの削除に失敗しました。`)
  }
}
