import { DatabaseError } from "@/app/(core)/appError";
import { projectExclusiveControl } from "./projectExclusiveControl";
import { ProjectDelete, ProjectInsert, ProjectUpdate } from "../_schema/projectSchema";
import { serverSupabase } from "@/app/(core)/_supabase/serverSupabase";

export const projectDao = {
  /** プロジェクトを挿入する */
  insert: async (record: ProjectInsert) => {
    // レコードを挿入する
    const { data, error } = await serverSupabase.rpc("insert_project_and_members", {
      _project_name: record.name,
      _project_detail: record.detail,
      _project_is_public: record.is_public,
      _user_ids: record.user_ids
    })
    
    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError('プロジェクトの作成に失敗しました。')
    };
    // 作成されたIDを返却する
    return data as number
  },

  /** プロジェクトを更新する */
  update: async (record: ProjectUpdate) => {
    // 存在をチェックする
    const beforeProject = await projectExclusiveControl.existsCheck(record.id)
    
    // 更新日時による排他制御を行う
    projectExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeProject.updated_at, 
      afterDate: record.updated_at
    })
    
    // プロジェクトを更新する
    const {error} = await serverSupabase.rpc("update_project_and_members", {
      _project_id: record.id,
      _project_name: record.name,
      _project_detail: record.detail,
      _project_is_public: record.is_public,
      _user_ids: record.user_ids
    })

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`更新時にエラーが発生しました。`)
    };
  },

  /** プロジェクトを削除する */
  delete: async (record: ProjectDelete) => {
    // 存在をチェックする
    const beforeProject = await projectExclusiveControl.existsCheck(record.id)
    
    // 更新日時による排他制御を行う
    projectExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeProject.updated_at, 
      afterDate: record.updated_at
    })
    
    const { error } = await serverSupabase.rpc("delete_project_and_members", {
      _project_id: record.id
    })

    // エラーをチェックする
    if (error) {
      console.log(error)
      throw new DatabaseError(`プロジェクトの削除に失敗しました。`);
    };
  }
}
