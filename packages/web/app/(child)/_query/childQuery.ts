import { ChildEntity, ChildEntitySchema } from "../_schema/childSchema"
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"

/** IDに紐づく子供を取得する */
export const fetchChild = async (userId: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("children")
    .select('*')
    .eq("user_id", userId)

  console.log("子情報", JSON.stringify(data))
  console.log("子エラー", JSON.stringify(error))

  // エラーをチェックする
  if (error) throw error

    return data && ChildEntitySchema.parse(data[0])
}
