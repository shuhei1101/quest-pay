import { RawChild } from "../_schema/childSchema";
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";

/** IDに紐づく子供を取得する */
export const fetchChild = async (userId: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("children")
      .select('*')
      .eq("user_id", userId).single();

    // エラーをチェックする
    if (error) throw error;

    return data as RawChild
}
