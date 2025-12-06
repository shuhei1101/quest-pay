import { SupabaseClient } from "@supabase/supabase-js"
import { IconWithCategoryViewSchema } from "./view"

/** 全てのアイコンとカテゴリを取得する */
export const fetchIcons = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  // データを取得する
  const { data, error } = await supabase.from("icon_with_category_view")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    return IconWithCategoryViewSchema.array().parse(data)
}
