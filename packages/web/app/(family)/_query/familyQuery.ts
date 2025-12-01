import { FamilyEntitySchema } from "../_schema/familySchema";
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";

/** IDに紐づく家族を取得する */
export const fetchFamily = async (id: number) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("families")
    .select('*')
    .eq("id", id)

  // エラーをチェックする
  if (error) throw error;

    return data && FamilyEntitySchema.parse(data[0])
}
