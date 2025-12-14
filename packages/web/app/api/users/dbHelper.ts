import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { fetchProfile } from "./query"

export const profileExclusiveControl = {
  /** 既に存在するかどうかを確認する */
  existsCheck: async ({id, supabase}: {
    id: string, 
    supabase: SupabaseClient
  }) => {
    const record = await fetchProfile({id, supabase})
    if (!record) throw new DatabaseError("既に削除されたユーザです。")
    return record
  },
  /** 他のユーザに更新されたか確認する（更新日時による排他チェック） */
  hasAlreadyUpdated: ({beforeDate, afterDate}: {
    beforeDate: string,
    afterDate: string
  }) => {

    if (beforeDate !== afterDate) {
      // 排他例外を発生させる
      throw new DatabaseError("他のユーザによって更新されました。")
    }
  }
}
