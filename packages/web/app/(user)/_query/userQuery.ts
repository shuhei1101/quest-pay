import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"
import { UserEntitySchema } from "../_schema/userSchema"


/** UserIdに紐づくユーザを取得する */
export const fetchUser = async (userId?: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("profiles")
      .select('*')
      .eq("user_id", userId)
      .single()

    // エラーをチェックする
    if (error) throw error

    if (!data || data.length === 0) {
      return undefined
    }

    return UserEntitySchema.parse(data)
}
