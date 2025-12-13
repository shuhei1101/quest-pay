import { ProfileEntitySchema } from "../entity"
import { SupabaseClient } from "@supabase/supabase-js"
import { UserInfoViewSchema } from "@/app/api/users/view"


/** UserIdに紐づくユーザを取得する */
export const fetchProfile = async ({userId, supabase}: {
  userId?: string
  supabase: SupabaseClient
}) => {
  // データを取得する
  const { data, error } = await supabase.from("profiles")
      .select('*')
      .eq("user_id", userId)
      .single()

    // エラーをチェックする
    if (error) throw error

    if (!data || data.length === 0) {
      return undefined
    }

    return ProfileEntitySchema.parse(data)
}

/** ユーザIDに紐づく自身の家族情報を取得する */
export const fetchUserInfo = async ({userId, supabase}: {
  userId: string,
  supabase: SupabaseClient
}) => {
  // データを取得する
  const { data, error } = await supabase.from("user_info_view")
    .select("*")
    .eq("user_id", userId)

  // エラーをチェックする
  if (error) throw error;

  return data.length !== 0 ? UserInfoViewSchema.parse(data[0]) : undefined
}

/** 子供IDに紐づく自身の家族情報を取得する */
export const fetchUserInfoByChildId = async ({childId, supabase}: {
  childId: string,
  supabase: SupabaseClient
}) => {
  // データを取得する
  const { data, error } = await supabase.from("user_info_view")
    .select("*")
    .eq("child_id", childId)

  // エラーをチェックする
  if (error) throw error;

  return data.length !== 0 ? UserInfoViewSchema.parse(data[0]) : undefined
}
