import { DatabaseError } from "@/app/(core)/appError";
import { familyExclusiveControl } from "./familyExclusiveControl";
import { FamilyDelete, FamilyInsert, FamilyUpdate } from "../_schema/familySchema";
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase";

export const familyDao = {
  /** 家族を挿入する */
  insert: async (record: FamilyInsert) => {
    // レコードを挿入する
    const { data, error } = await serverSupabase.from("families")
    .insert([record])
    .select("id")
    .single();
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('家族の作成に失敗しました。')
    };
    // 作成されたIDを返却する
    return data.id
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
    .eq("id", record.id);

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    };
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
      .eq("id", record.id);

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`家族の削除に失敗しました。`);
    };
  }
}
