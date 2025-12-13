import { SupabaseClient } from "@supabase/supabase-js"
import { ChildEntitySchema } from "./entity"

/** 使用可能な子供招待コードか確認する */
export const getChildByInviteCode = async ({supabase, code}: {
  supabase: SupabaseClient,
  code: string
}) => {
  const { data } = await supabase
    .from("children")
    .select("*")
    .eq("invite_code", code)
    .maybeSingle()

  return data ? ChildEntitySchema.parse(data) : null
}
