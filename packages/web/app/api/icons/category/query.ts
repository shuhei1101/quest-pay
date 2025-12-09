import { SupabaseClient } from "@supabase/supabase-js"
import { IconCategoryEntitySchema } from "./entity"
import { devLog } from "@/app/(core)/util"

/** 全てのアイコンカテゴリを取得する */
export const fetchIconCategories = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  // データを取得する
  const { data, error } = await supabase.from("icon_categories")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchIconCategories.アイコンカテゴリ取得: ", data)

    return IconCategoryEntitySchema.array().parse(data)
}
