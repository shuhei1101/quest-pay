import { SupabaseClient } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"
import { IconEntitySchema } from "./entity"

/** 全てのアイコンとカテゴリを取得する */
export const fetchIcons = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  // データを取得する
  const { data, error } = await supabase.from("icons")
      .select(`*`)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchIcons.アイコン取得: ", data)

    return IconEntitySchema.array().parse(data)
}
