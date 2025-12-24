import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { db } from "@/index"
import { profiles, children, ProfileInsert, ChildInsert } from "@/drizzle/schema"
import { insertChild, InsertChildEntity } from "./db"
import { insertChildProfile, InsertChildProfileEntity, insertProfile } from "../users/db"

/** 子供を登録する */
export const registerChild = async ({profile, child}: {
  profile: InsertChildProfileEntity
  child: Omit<InsertChildEntity, "profileId">
}) => {
  try {
    // トランザクションで複数テーブルに挿入する
    const result = await db.transaction(async (tx) => {
      // プロフィールを挿入する
      const { id: profileId } = await insertChildProfile({db: tx,
        entity: {
          ...profile,
        }
      })

      // 子供を挿入する
      const { id: childId } = await insertChild({db: tx, entity: {
        profileId,
        ...child
      }})

      return childId
    })

    return result
  } catch (error) {
    devLog("insertChild.例外.ソース: ", {error, profile, child})
    throw new DatabaseError('子供の登録に失敗しました。')
  }
}
