import { SupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"
import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { ParentViewSchema } from "@/app/api/parents/view"

export const FetchParentsResult = ParentViewSchema.array()

/** 家族IDに一致する親を取得する */
export const fetchParentsByFamilyId = async ({
  supabase,
  familyId
}: {
  supabase: SupabaseClient,
  familyId: string
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("parent_view")
      .select(`*`)
      .eq("family_id", familyId)
      .not("id", "is", null)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchParentsByFamilyId.取得データ: ", data)

    return data.length > 0 ? FetchParentsResult.parse(data) : []
  } catch (error) {
    devLog("fetchParentsByFamilyId.取得例外: ", error)
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}

export const FetchParentResult = ParentViewSchema

/** IDに一致する親を取得する */
export const fetchParent = async ({
  supabase,
  parentId
}: {
  supabase: SupabaseClient,
  parentId: string
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("parent_view")
      .select(`*`)
      .eq("id", parentId)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchParent.取得データ: ", data)

    return data.length > 0 ? FetchParentResult.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchParent.取得例外: ", error)
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

// /** 使用可能な親招待コードか確認する */
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

//   return data ? ParentEntitySchema.parse(data) : null
//   } catch (error) {
//     devLog("getParentByInviteCode.取得例外: ", error)
//     throw new QueryError("招待コードの生成に失敗しました。")
//   }
// }
