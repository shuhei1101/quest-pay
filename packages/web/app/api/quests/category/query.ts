import { SupabaseClient } from "@supabase/supabase-js";
import { QuestCategoryEntitySchema } from "./entity";
import { devLog } from "@/app/(core)/util";

/** 全てのアイコンカテゴリを取得する */
export const fetchQuestCategories = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  // データを取得する
  const { data, error } = await supabase.from("quest_categories")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchQuestCategories.取得クエストカテゴリ: ", data)


    return QuestCategoryEntitySchema.array().parse(data)
}
