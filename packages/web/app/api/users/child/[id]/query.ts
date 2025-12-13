import { SupabaseClient } from "@supabase/supabase-js"
import { UserInfoViewSchema } from "@/app/api/users/view"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"

/** 子供IDに紐づく自身の家族情報を取得する */
export const fetchUserInfoByChildId = async ({childId, supabase}: {
  childId: string,
  supabase: SupabaseClient
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("user_info_view")
      .select("*")
      .eq("child_id", childId)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchUserInfoByChildId.取得データ: ", data)

    return data.length !== 0 ? UserInfoViewSchema.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchChildren.取得例外: ", error)
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}
