import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { icons, parents, profiles } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export type Parents = Parent[]

/** 家族IDに一致する親を取得する */
export const fetchFamilyParents = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(parents)
      .leftJoin(profiles, eq(profiles.id, parents.profileId))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(profiles.familyId, familyId))

    devLog("fetchParentsByFamilyId.取得データ: ", data)

    return data as Parents
  } catch (error) {
    devLog("fetchParentsByFamilyId.取得例外: ", error)
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}

export type Parent = Awaited<ReturnType<typeof fetchParent>>

/** IDに一致する親を取得する */
export const fetchParent = async ({ db, parentId }: {
  db: Db,
  parentId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(parents)
      .leftJoin(profiles, eq(profiles.id, parents.profileId))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(parents.id, parentId))
    devLog("fetchParent.取得データ: ", data)

    return data[0]
  } catch (error) {
    devLog("fetchParent.取得例外: ", error)
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}
