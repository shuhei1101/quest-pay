import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { ProfileEntity } from "../users/entity"
import { devLog } from "@/app/(core)/util"
import { insertFamily, InsertFamilyEntity } from "./db"
import { db } from "@/index"
import { insertParentProfile, InsertParentProfileEntity, insertProfile } from "../users/db"
import { FamilyInsert, ProfileInsert } from "@/drizzle/schema"
import { insertParent, InsertParentEntity } from "../parents/db"

/** 家族と親を挿入する */
export const registerFamilyAndParent = async ({family, profile, parent}: {
  family: InsertFamilyEntity,
  profile: Omit<InsertParentProfileEntity, "familyId">,
  parent: Omit<InsertParentEntity, "profileId">
}) => {
  try {
    const result = await db.transaction(async (tx) => {
      
      // 家族を挿入する
      const { id: familyId } = await insertFamily({db: tx, entity: family})

      // プロフィールを挿入する
      const { id: profileId } = await insertParentProfile({db: tx, entity: {
        ...profile,
        familyId
      }})

      // 親を挿入する
      const { id: parentId } = await insertParent({db: tx, entity: {
        profileId,
        ...parent}
      })
    })
  } catch (error) {
    devLog("insertChild.例外.ソース: ", {error, family, profile, parent})
    throw new DatabaseError('家族の登録に失敗しました。')
  }
}
