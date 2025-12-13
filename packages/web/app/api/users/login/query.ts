import { SupabaseClient } from "@supabase/supabase-js"
import { UserInfoViewSchema } from "@/app/api/users/view"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"

/** ユーザIDに紐づくユーザ情報を取得する */
export const fetchUserInfo = async ({userId, supabase}: {
  userId: string,
  supabase: SupabaseClient
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("user_info_view")
      .select("*")
      .eq("user_id", userId)

    // エラーをチェックする
    if (error) throw error

    return data.length !== 0 ? UserInfoViewSchema.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchUserInfo.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}
