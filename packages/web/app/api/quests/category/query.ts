import { SupabaseClient } from "@supabase/supabase-js";
import { QuestCategoryEntitySchema } from "./entity";

/** 全てのアイコンカテゴリを取得する */
export const fetchQuestCategories = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  // データを取得する
  const { data, error } = await supabase.from("quest_categories")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    return QuestCategoryEntitySchema.array().parse(data)
}
