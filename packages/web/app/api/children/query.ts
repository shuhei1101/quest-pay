import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db, Tx } from "@/index"
import { children, ChildSelectSchema, profiles, ProfileSelectSchema } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"
import z from "zod"

export const FetchChildResultSchema = z.object({
  children: ChildSelectSchema,
  profiles: ProfileSelectSchema.nullable()
})
export const FetchChildrenResultSchema = z.array(FetchChildResultSchema)
export type FetchChildrenResult = z.infer<typeof FetchChildrenResultSchema>
/** 家族IDに一致する子供を取得する */
export const fetchChildrenByFamilyId = async ({ db, familyId }: {
  db: Db | Tx,
  familyId: string
}): Promise<FetchChildrenResult> => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .leftJoin(profiles, eq(children.profileId, profiles.id))
      .where(eq(profiles.familyId, familyId))

    devLog("fetchChildrenByFamilyId.取得データ: ", data)

    return data
  } catch (error) {
    devLog("fetchChildrenByFamilyId.取得例外: ", error)
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

/** 子供IDに一致する子供を取得する */
export const fetchChild = async ({ db,  childId }: {
  db: Db | Tx,
  childId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .leftJoin(profiles, eq(children.profileId, profiles.id))
      .where(eq(children.id, childId))

    devLog("fetchChild.取得データ: ", data)

    return data[0]
  } catch (error) {
    devLog("fetchChild.取得例外: ", error)
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

/** 招待コードに紐づく子供を取得する */
export const fetchChildByInviteCode = async ({db, invite_code}: {
  db: Db | Tx,
  invite_code: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .where(eq(children.inviteCode, invite_code))


  return data[0]
  } catch (error) {
    devLog("getChildByInviteCode.取得例外: ", error)
    throw new QueryError("招待コードの生成に失敗しました。")
  }
}
