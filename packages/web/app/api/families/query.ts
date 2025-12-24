import { SupabaseClient } from "@supabase/supabase-js"
import { devLog, generateInviteCode } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db, db, Tx } from "@/index"
import { families } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

/** 家族を取得する */
export const fetchFamily = async ({ db, familyId }: {
  db: Db | Tx,
  familyId: string
}) => {
  try {

    // データを取得する
    const user = await db
      .select()
      .from(families)
      .where(eq(families.id, familyId))
      .limit(1)

      devLog("fetchFamily.取得データ: ", user)

      return user.length > 0 ? user[0] : null
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

    return data ? FamilyEntityScheme.parse(data) : null
  } catch (error) {
    devLog("getFamilyByInviteCode.取得例外: ", error)
    throw new QueryError("家族招待コードの生成に失敗しました。")
  }
}
