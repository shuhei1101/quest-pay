import { SupabaseClient } from "@supabase/supabase-js"
import { UserInfoViewSchema } from "@/app/api/users/view"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { ProfileEntitySchema } from "./entity"

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

    return data.length !== 0 ? ProfileEntitySchema.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchProfile.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}

/** 招待コードに紐づく子供情報を取得する */
export const fetchProfileByChildInviteCode = async ({inviteCode, supabase}: {
  inviteCode: string,
  supabase: SupabaseClient
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("profile")
      .select("*")
      .eq("child_invite_code", inviteCode)

    // エラーをチェックする
    if (error) throw error

    return data.length !== 0 ? ProfileEntitySchema.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchProfileByChildInviteCode.取得例外: ", error)
    throw new QueryError("招待コードに紐づく子供情報の読み込みに失敗しました。")
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

    return data.length !== 0 ? UserInfoViewSchema.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchUserInfo.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}
