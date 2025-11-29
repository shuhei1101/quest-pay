import { RawFamily } from "../_schema/familySchema";
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";

/** IDに紐づく家族を取得する */
export const fetchFamily = async (id: number) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("Families")
      .select('*')
      .eq("id", id).single();

    // エラーをチェックする
    if (error) throw error;

    return data as RawFamily
}
