import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db, Tx } from "@/index"
import { parents, ParentSelectSchema, profiles, ProfileSelectSchema } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import z from "zod"

export const FetchParentResultSchema = z.object({
  parents: ParentSelectSchema,
  profiles: ProfileSelectSchema.nullable(),
})
export const FetchParentsResultSchema = z.array(FetchParentResultSchema)
export type FetchParentResult = z.infer<typeof FetchParentResultSchema>
export type FetchParentsResult = z.infer<typeof FetchParentsResultSchema>

/** 家族IDに一致する親を取得する */
export const fetchParentsByFamilyId = async ({ db, familyId }: {
  db: Db | Tx,
  familyId: string
}): Promise<FetchParentsResult> => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(parents)
      .leftJoin(profiles, eq(profiles.id, parents.profileId))
      .where(eq(profiles.familyId, familyId))

    devLog("fetchParentsByFamilyId.取得データ: ", data)

    return data
  } catch (error) {
    devLog("fetchParentsByFamilyId.取得例外: ", error)
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}


/** IDに一致する親を取得する */
export const fetchParent = async ({ db, parentId }: {
  db: Db | Tx,
  parentId: string
}): Promise<FetchParentResult | undefined> => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(parents)
      .leftJoin(profiles, eq(profiles.id, parents.profileId))
      .where(eq(parents.id, parentId))
    devLog("fetchParent.取得データ: ", data)

    return data[0]
  } catch (error) {
    devLog("fetchParent.取得例外: ", error)
    throw new QueryError("親情報の読み込みに失敗しました。")
  }
}
