import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { insertFamily, InsertFamilyRecord } from "./db"
import { insertParentProfile, InsertParentProfileRecord } from "../users/db"
import { insertParent, InsertParentRecord } from "../parents/db"
import { Db, Tx } from "@/index"

/** 家族と親を挿入する */
export const registerFamilyAndParent = async ({db, family, profile, parent}: {
  db: Tx | Db,
  family: InsertFamilyRecord,
  profile: Omit<InsertParentProfileRecord, "familyId">,
  parent: Omit<InsertParentRecord, "profileId">
}) => {
  try {
    const result = await db.transaction(async (tx) => {
      
      // 家族を挿入する
      const { id: familyId } = await insertFamily({db: tx, record: family})

      // プロフィールを挿入する
      const { id: profileId } = await insertParentProfile({db: tx, record: {
        ...profile,
        familyId
      }})

      // 親を挿入する
      const { id: parentId } = await insertParent({db: tx, record: {
        profileId,
        ...parent}
      })
    })
  } catch (error) {
    devLog("insertChild.例外.ソース: ", {error, family, profile, parent})
    throw new DatabaseError('家族の登録に失敗しました。')
  }
}
