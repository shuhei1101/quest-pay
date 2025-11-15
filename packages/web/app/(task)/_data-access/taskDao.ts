import { DatabaseError } from "@/app/(core)/appError";
import { taskExclusiveControl } from "./taskExclusiveControl";
import { RawTask, TaskDelete, TaskInsert, TaskUpdate } from "../_schema/taskSchema";
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase";

export const taskDao = {
  /** タスクを挿入する */
  insert: async (record: TaskInsert) => {
    // レコードを挿入する
    const { data, error } = await serverSupabase.from("tasks")
    .insert([record])
    .select("id")
    .single();
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('タスクの作成に失敗しました。')
    };
    // 作成されたIDを返却する
    return data.id
  },

  /** タスクを更新する */
  update: async (record: TaskUpdate) => {
    // 存在をチェックする
    const beforeTask = await taskExclusiveControl.existsCheck(record.id)
    
    // 更新日時による排他制御を行う
    taskExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeTask.updated_at, 
      afterDate: record.updated_at
    })
    
    // タスクを更新する
    const {error} = await serverSupabase.from("tasks")
    .update(record)
    .eq("id", record.id);

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    };
  },

  /** タスクを削除する */
  delete: async (record: TaskDelete) => {
    // 存在をチェックする
    const beforeTask = await taskExclusiveControl.existsCheck(record.id)
    
    // 更新日時による排他制御を行う
    taskExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeTask.updated_at, 
      afterDate: record.updated_at
    })
    
    const { error } = await serverSupabase.from("tasks")
      .delete()
      .eq("id", record.id);

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`タスクの削除に失敗しました。`);
    };
  }
}
