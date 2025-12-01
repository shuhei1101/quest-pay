import { DatabaseError } from "@/app/(core)/appError"
import { familyExclusiveControl } from "./familyExclusiveControl"
import { FamilyDelete, FamilyInsert, FamilyUpdate } from "../_schema/familySchema"
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase"
import { UserInsert } from "@/app/(user)/_schema/userSchema"

export const familyDao = {
  /** 家族を挿入する */
  insert: async ({family, parent}: {
    family: FamilyInsert,
    parent: UserInsert,
  }) => {
    // レコードを挿入する
    const { data, error } = await serverSupabase.rpc("insert_family_and_parent", {
      _user_id: parent.user_id,
      _display_id: family.display_id,
      _local_name: family.local_name,
      _online_name: family.online_name,
      _family_icon: family.icon,
      _parent_name: parent.name,
      _parent_icon: parent.icon,
      _parent_birthday: parent.birthday
    })
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('家族の作成に失敗しました。')
    }
    return
  },

  /** 家族を更新する */
  update: async (record: FamilyUpdate) => {
    // 存在をチェックする
    const beforeFamily = await familyExclusiveControl.existsCheck(record.id)
    
    // 更新日時による排他制御を行う
    familyExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeFamily.updated_at, 
      afterDate: record.updated_at
    })
    
    // 家族を更新する
    const {error} = await serverSupabase.from("families")
    .update(record)
    .eq("id", record.id)

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    }
  },

  /** 家族を削除する */
  delete: async (record: FamilyDelete) => {
    // 存在をチェックする
    const beforeFamily = await familyExclusiveControl.existsCheck(record.id)
    
    // 更新日時による排他制御を行う
    familyExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeFamily.updated_at, 
      afterDate: record.updated_at
    })
    
    const { error } = await serverSupabase.from("families")
      .delete()
      .eq("id", record.id)

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`家族の削除に失敗しました。`)
    }
  }
}
