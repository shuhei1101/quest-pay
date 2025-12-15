import { SupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { ParentViewScheme } from "../view"


// /** 使用可能な子供招待コードか確認する */
// export const getParentByInviteCode = async ({supabase, code}: {
//   supabase: SupabaseClient,
//   code: string
// }) => {
//   try {
//   const { data } = await supabase
//     .from("children")
//     .select("*")
//     .eq("invite_code", code)
//     .maybeSingle()

//   return data ? ParentEntityScheme.parse(data) : null
//   } catch (error) {
//     devLog("getParentByInviteCode.取得例外: ", error)
//     throw new QueryError("招待コードの生成に失敗しました。")
//   }
// }
