import { DatabaseError } from "@/app/(core)/appError"
import { questExclusiveControl } from "./questExclusiveControl"
import { QuestDelete, QuestInsert, QuestUpdate } from "../_schema/questEntity"
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase"

export const questDao = {
  /** クエストを挿入する */
  insert: async ({quest, tags}: {
    quest: QuestInsert,
    tags: string[]
  }) => {
    // レコードを挿入する
    const { error } = await serverSupabase.rpc("insert_quest", {
      _name: quest.name,
      _type: quest.type,
      _icon: quest.icon,
      _tags: tags
    })
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('クエストの作成に失敗しました。')
    }
  },

  /** クエストを更新する */
  update: async ({quest, tags}: {
    quest: QuestUpdate,
    tags: string[]
  }) => {
    // 存在をチェックする
    const beforeQuest = await questExclusiveControl.existsCheck(quest.id)
    
    // 更新日時による排他制御を行う
    questExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeQuest.updated_at, 
      afterDate: quest.updated_at
    })
    
    // クエストを更新する
    const {error} = await serverSupabase.rpc('update_quest', {
      _quest_id: quest.id,
      _name: quest.name,
      _type: quest.type,
      _icon: quest.icon,
      _tags: tags
    })

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    }
  },

  /** クエストを削除する */
  delete: async (quest: QuestDelete) => {
    // 存在をチェックする
    const beforeQuest = await questExclusiveControl.existsCheck(quest.id)
    
    // 更新日時による排他制御を行う
    questExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeQuest.updated_at, 
      afterDate: quest.updated_at
    })
    
    const { error } = await serverSupabase.rpc('delete_quest', {
      _quest_id: quest.id
    })

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`クエストの削除に失敗しました。`)
    }
  }
}
