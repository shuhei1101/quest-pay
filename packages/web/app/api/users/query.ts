import { SupabaseClient } from "@supabase/supabase-js"
import { UserInfoViewScheme } from "@/app/api/users/view"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { ProfileEntityScheme } from "./entity"

/** プロフィールを取得する */
export const fetchProfile = async ({id, supabase}: {
  id: string,
  supabase: SupabaseClient
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("profiles")
      .select("*")
      .eq("id", id)

    // エラーをチェックする
    if (error) throw error

    return data.length !== 0 ? ProfileEntityScheme.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchProfile.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}


/** ユーザIDに紐づくユーザ情報を取得する */
export const fetchUserInfoByUserId = async ({userId, supabase}: {
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

    devLog("fetchUserInfoByUserId.取得データ: ", data)

    return data.length !== 0 ? UserInfoViewScheme.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchUserInfoByUserId.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}
