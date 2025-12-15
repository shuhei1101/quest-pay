import { SupabaseClient } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"
import { IconEntityScheme } from "./entity"
import { QueryError } from "@/app/(core)/error/appError"

/** 全てのアイコンとカテゴリを取得する */
export const fetchIcons = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("icons")
        .select(`*`)

      // エラーをチェックする
      if (error) throw error

      devLog("fetchIcons.アイコン取得: ", data)

      return IconEntityScheme.array().parse(data)
  } catch (error) {
    devLog("fetchIcons.取得例外: ", error)
    throw new QueryError("アイコン情報の読み込みに失敗しました。")
  }
}
