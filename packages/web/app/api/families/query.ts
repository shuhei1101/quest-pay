import { devLog, generateInviteCode } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { families } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

/** 家族を取得する */
export const fetchFamily = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {

    // データを取得する
    const family = await db
      .select()
      .from(families)
      .where(eq(families.id, familyId))
      .limit(1)

      devLog("fetchFamily.取得データ: ", family)

      return family[0]
  } catch (error) {
    devLog("fetchFamily.取得例外: ", error)
    throw new QueryError("家族情報の読み込みに失敗しました。")
  }
}

/** 使用可能な家族招待コードか確認する */
export const getFamilyByInviteCode = async ({db, code}: {
  db: Db,
  code: string
}) => {
  try {
    // データを取得する
    const family = await db
      .select()
      .from(families)
      .where(eq(families.inviteCode, code))
      .limit(1)

    return family
  } catch (error) {
    devLog("getFamilyByInviteCode.取得例外: ", error)
    throw new QueryError("家族招待コードの生成に失敗しました。")
  }
}
