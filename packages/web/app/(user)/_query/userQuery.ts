import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"
import { RawUser } from "../_schema/userSchema"
import { RawUserType } from "../_schema/userTypeSchema"


/** UserIdに紐づくユーザを取得する */
export const fetchUser = async (userId?: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("profiles")
      .select('*')
      .eq("user_id", userId)

    // エラーをチェックする
    if (error) throw error

    if (!data || data.length === 0) {
      return undefined
    }

    return data[0] as RawUser
}


/** 全ユーザタイプを取得する */
export const fetchUserTypes = async () => {
  // データを取得する
  const { data, error } = await clientSupabase.from("profile_types")
    .select('*')

  // エラーをチェックする
  if (error) throw error

  return data as RawUserType[] ?? []
}
