import { SupabaseClient } from "@supabase/supabase-js";
import { QuestCategoryEntityScheme } from "./entity";
import { devLog } from "@/app/(core)/util";
import { QueryError } from "@/app/(core)/error/appError";

/** 全てのクエストカテゴリを取得する */
export const fetchQuestCategories = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("quest_categories")
        .select(`*`)

      // エラーをチェックする
      if (error) throw error

      devLog("fetchQuestCategories.取得クエストカテゴリ: ", data)

      return QuestCategoryEntityScheme.array().parse(data)
  } catch (error) {
    devLog("fetchQuestCategories.取得例外: ", error)
    throw new QueryError("クエストカテゴリの読み込みに失敗しました。")
  }
}
