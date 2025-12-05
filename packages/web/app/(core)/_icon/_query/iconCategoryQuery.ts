import { IconCategoryEntitySchema } from "../_schema/iconCategorySchema"
import { clientSupabase } from "@/app/(core)/_supabase/client"

/** 全てのアイコンカテゴリを取得する */
export const fetchIconCategories = async () => {
  // データを取得する
  const { data, error } = await clientSupabase.from("icon_categories")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    return IconCategoryEntitySchema.array().parse(data)
}

/** IDに紐づくアイコンを取得する */
export const fetchIconCategory = async (id: number) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("icon_categories")
      .select('*')
      .eq("id", id).single()

    // エラーをチェックする
    if (error) throw error

    return IconCategoryEntitySchema.parse(data)
}
