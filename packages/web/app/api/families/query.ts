import { SupabaseClient } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"
import { FamilyEntitySchema } from "./entity"
import { generateInviteCode } from "./invite/service"
import { ServerError } from "@/app/(core)/appError"

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

/** 家族招待コードが使用可能か確認する */
export const generateUniqueInviteCode = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  for (let i = 0; i < 10; i++) {
    // 招待コードを生成する
    const code = generateInviteCode()

    const { data } = await supabase
      .from("families")
      .select("id")
      .eq("invite_code", code)
      .maybeSingle()

    // 招待コードが存在していない場合
    if (data === null) {
      // コードを返却する
      return code
    }
  }
  throw new ServerError("招待コードの生成に失敗しました")
}
