import { SupabaseClient } from "@supabase/supabase-js"
import { devLog, generateInviteCode } from "@/app/(core)/util"
import { FamilyEntitySchema } from "./entity"

/** 家族を取得する */
export const fetchFamily = async ({
  supabase,
  familyId
}: {
  supabase: SupabaseClient,
  familyId: string
}) => {

  // データを取得する
  const { data, error } = await supabase.from("families")
    .select(`*`)
    .eq("id", familyId)

    if (error) throw error

    devLog("fetchFamily.取得データ: ", data)

    return data.length > 0 ? FamilyEntitySchema.parse(data[0]) : undefined
}

/** 使用可能な家族招待コードか確認する */
export const getFamilyByInviteCode = async ({supabase, code}: {
  supabase: SupabaseClient,
  code: string
}) => {
  const { data } = await supabase
    .from("families")
    .select("*")
    .eq("invite_code", code)
    .maybeSingle()

  return data ? FamilyEntitySchema.parse(data) : null
}
