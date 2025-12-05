import { SupabaseClient } from "@supabase/supabase-js";
import { FamilyEntitySchema } from "./_schema/familyEntity";

/** IDに紐づく家族を取得する */
export const fetchFamily = async ({supabase, id}: {
  id: number
  supabase: SupabaseClient
}) => {
  // データを取得する
  const { data, error } = await supabase.from("families")
    .select('*')
    .eq("id", id)

  // エラーをチェックする
  if (error) throw error;

  return data.length !== 0 ? FamilyEntitySchema.parse(data[0]) : undefined
}
