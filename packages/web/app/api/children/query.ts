import { SupabaseClient } from "@supabase/supabase-js"
import { ChildEntityScheme } from "./entity"
import { z } from "zod"
import { devLog } from "@/app/(core)/util"
import { ChildViewScheme } from "./view"
import { QueryError } from "@/app/(core)/error/appError"

export const FetchChildrenResult = ChildViewScheme.array()

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

export const FetchChildResult = ChildViewScheme

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

/** 招待コードに紐づく子供を取得する */
export const fetchChildByInviteCode = async ({supabase, invite_code}: {
  supabase: SupabaseClient,
  invite_code: string
}) => {
  try {
  const { data } = await supabase
    .from("children")
    .select("*")
    .eq("invite_code", invite_code)

  return data ? ChildEntityScheme.parse(data[0]) : undefined
  } catch (error) {
    devLog("getChildByInviteCode.取得例外: ", error)
    throw new QueryError("招待コードの生成に失敗しました。")
  }
}
