import { SupabaseClient } from "@supabase/supabase-js"
import { IconCategoryEntityScheme } from "./entity"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"

/** 全てのアイコンカテゴリを取得する */
export const fetchIconCategories = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("icon_categories")
        .select(`*`)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchIconCategories.アイコンカテゴリ取得: ", data)

    return IconCategoryEntityScheme.array().parse(data)
  } catch (error) {
    devLog("fetchIconCategories.取得例外: ", error)
    throw new QueryError("アイコンカテゴの読み込みに失敗しました。")
  }
}
