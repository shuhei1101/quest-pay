import { DatabaseError } from "@/app/(core)/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { fetchFamilyQuest } from "./query"

export const questExclusiveControl = {
  /** 既に存在するかどうかを確認する */
  existsCheck: async ({id, supabase}: {
    id: string, 
    supabase: SupabaseClient
  }) => {
    const record = await fetchFamilyQuest({questId: id, supabase})
    if (!record) throw new DatabaseError("既に削除されたクエストです。")
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
