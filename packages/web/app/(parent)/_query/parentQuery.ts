import { ParentEntitySchema } from "../_schema/parentEntity"
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"

/** IDに紐づく親を取得する */
export const fetchParent = async (userId: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("parents")
    .select('*')
    .eq("user_id", userId)

  // エラーをチェックする
  if (error) throw error

  console.log("親情報", JSON.stringify(data))

  return data && ParentEntitySchema.parse(data[0])
}
