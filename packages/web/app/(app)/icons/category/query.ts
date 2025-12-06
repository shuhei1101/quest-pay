import { SupabaseClient } from "@supabase/supabase-js"
import { IconCategoryEntitySchema } from "./entity"

/** 全てのアイコンカテゴリを取得する */
export const fetchIconCategories = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  // データを取得する
  const { data, error } = await supabase.from("icon_categories")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    return IconCategoryEntitySchema.array().parse(data)
}
