import { SupabaseClient } from "@supabase/supabase-js"
import { devLog, generateInviteCode } from "@/app/(core)/util"
import { FamilyEntitySchema } from "./entity"
import { QueryError } from "@/app/(core)/error/appError"

/** 家族を取得する */
export const fetchFamily = async ({
  supabase,
  familyId
}: {
  supabase: SupabaseClient,
  familyId: string
}) => {
  try {

    // データを取得する
    const { data, error } = await supabase.from("families")
      .select(`*`)
      .eq("id", familyId)

      if (error) throw error

      devLog("fetchFamily.取得データ: ", data)

      return data.length > 0 ? FamilyEntitySchema.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchFamily.取得例外: ", error)
    throw new QueryError("家族情報の読み込みに失敗しました。")
  }
}

/** 使用可能な家族招待コードか確認する */
export const getFamilyByInviteCode = async ({supabase, code}: {
  supabase: SupabaseClient,
  code: string
}) => {
  try {
    const { data, error } = await supabase
      .from("families")
      .select("*")
      .eq("invite_code", code)
      .maybeSingle()

    if (error) throw error

    return data ? FamilyEntitySchema.parse(data) : null
  } catch (error) {
    devLog("getFamilyByInviteCode.取得例外: ", error)
    throw new QueryError("家族招待コードの生成に失敗しました。")
  }
}
