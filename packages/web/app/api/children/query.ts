import { SupabaseClient } from "@supabase/supabase-js"
import { ChildEntitySchema } from "./entity"
import { z } from "zod"
import { devLog } from "@/app/(core)/util"
import { ChildViewSchema } from "./view"
import { QueryError } from "@/app/(core)/error/appError"

export const FetchChildrenResult = ChildViewSchema.array()

/** 家族IDに一致する子供を取得する */
export const fetchChildrenByFamilyId = async ({
  supabase,
  familyId
}: {
  supabase: SupabaseClient,
  familyId: string
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("child_view")
      .select(`*`)
      .eq("family_id", familyId)
      .not("id", "is", null)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchChildrenByFamilyId.取得データ: ", data)

    return data.length > 0 ? FetchChildrenResult.parse(data) : []
  } catch (error) {
    devLog("fetchChildrenByFamilyId.取得例外: ", error)
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

export const FetchChildResult = ChildViewSchema

/** 子供IDに一致する子供を取得する */
export const fetchChild = async ({
  supabase,
  childId
}: {
  supabase: SupabaseClient,
  childId: string
}) => {
  try {
    // データを取得する
    const { data, error } = await supabase.from("child_view")
      .select(`*`)
      .eq("id", childId)

    // エラーをチェックする
    if (error) throw error

    devLog("fetchChild.取得データ: ", data)

    return data.length > 0 ? FetchChildResult.parse(data[0]) : undefined
  } catch (error) {
    devLog("fetchChild.取得例外: ", error)
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

/** 使用可能な子供招待コードか確認する */
export const getChildByInviteCode = async ({supabase, code}: {
  supabase: SupabaseClient,
  code: string
}) => {
  try {
  const { data } = await supabase
    .from("children")
    .select("*")
    .eq("invite_code", code)
    .maybeSingle()

  return data ? ChildEntitySchema.parse(data) : null
  } catch (error) {
    devLog("getChildByInviteCode.取得例外: ", error)
    throw new QueryError("招待コードの生成に失敗しました。")
  }
}
