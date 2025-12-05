import { DatabaseError } from "@/app/(core)/appError"
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase"
import { ProfileDelete, ProfileInsert, ProfileUpdate } from "../entity"
import { userExclusiveControl } from "./userExclusiveControl"

export const userDao = {
  /** ユーザを挿入する */
  insert: async (record: ProfileInsert) => {
    // レコードを挿入する
    const { data, error } = await serverSupabase.from("profiles")
    .insert([record])
    .select("user_id")
    .single()
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('ユーザの作成に失敗しました。')
    }
    // 作成されたIDを返却する
    return data.user_id
  },

  /** ユーザを更新する */
  update: async (record: ProfileUpdate) => {
    // 存在をチェックする
    const beforeUser = await userExclusiveControl.existsCheck(record.user_id)
    
    // 更新日時による排他制御を行う
    userExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeUser.updated_at, 
      afterDate: record.updated_at
    })
    
    // ユーザを更新する
    const {error} = await serverSupabase.from("profiles")
    .update(record)
    .eq("user_id", record.user_id)

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    }
  },

  /** ユーザを削除する */
  delete: async (record: ProfileDelete) => {
    // 存在をチェックする
    const beforeUser = await userExclusiveControl.existsCheck(record.user_id)
    
    // 更新日時による排他制御を行う
    userExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeUser.updated_at, 
      afterDate: record.updated_at
    })
    
    const { error } = await serverSupabase.from("profiles")
      .delete()
      .eq("user_id", record.user_id)

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`ユーザの削除に失敗しました。`)
    }
  }
}
