import { RawParent } from "../_schema/parentSchema";
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";

/** IDに紐づく親を取得する */
export const fetchParent = async (userId: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("Parents")
      .select('*')
      .eq("user_id", userId).single();

    // エラーをチェックする
    if (error) throw error;

    return data as RawParent
}
