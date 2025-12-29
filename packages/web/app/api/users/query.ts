import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { children, families, parents, profiles } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

/** プロフィールを取得する */
export const fetchProfile = async ({id, db}: {
  id: string,
  db: Db
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))

    return data[0]
  } catch (error) {
    devLog("fetchProfile.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}

export type UserInfo = Awaited<ReturnType<typeof fetchUserInfoByUserId>>

/** ユーザIDに紐づくユーザ情報を取得する */
export const fetchUserInfoByUserId = async ({userId, db}: {
  userId: string,
  db: Db
}) => {
  try {
    // データを取得する
    const data = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        child: true,
        parent: true,
        family: true,
      }
    })

    devLog("fetchUserInfoByUserId.取得データ: ", data)

    return data
  } catch (error) {
    devLog("fetchUserInfoByUserId.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}
