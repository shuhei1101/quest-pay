import { DatabaseError } from "@/app/(core)/appError"
import { taskExclusiveControl } from "./taskExclusiveControl"
import { TaskDelete, TaskInsert, TaskUpdate } from "../_schema/taskEntity"
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase"

export const taskDao = {
  /** タスクを挿入する */
  insert: async ({task, tags}: {
    task: TaskInsert,
    tags: string[]
  }) => {
    // レコードを挿入する
    const { error } = await serverSupabase.rpc("insert_task", {
      _name: task.name,
      _type: task.type,
      _icon: task.icon,
      _tags: tags
    })
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('タスクの作成に失敗しました。')
    }
  },

  /** タスクを更新する */
  update: async ({task, tags}: {
    task: TaskUpdate,
    tags: string[]
  }) => {
    // 存在をチェックする
    const beforeTask = await taskExclusiveControl.existsCheck(task.id)
    
    // 更新日時による排他制御を行う
    taskExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeTask.updated_at, 
      afterDate: task.updated_at
    })
    
    // タスクを更新する
    const {error} = await serverSupabase.rpc('update_task', {
      _task_id: task.id,
      _name: task.name,
      _type: task.type,
      _icon: task.icon,
      _tags: tags
    })

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    }
  },

  /** タスクを削除する */
  delete: async (task: TaskDelete) => {
    // 存在をチェックする
    const beforeTask = await taskExclusiveControl.existsCheck(task.id)
    
    // 更新日時による排他制御を行う
    taskExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeTask.updated_at, 
      afterDate: task.updated_at
    })
    
    const { error } = await serverSupabase.rpc('delete_task', {
      _task_id: task.id
    })

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`タスクの削除に失敗しました。`)
    }
  }
}
