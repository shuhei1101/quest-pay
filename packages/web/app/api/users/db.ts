import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"
import { profileExclusiveControl } from "./dbHelper"
import { children, ProfileInsert, profiles } from "@/drizzle/schema"
import { Db, Tx } from "@/index"

export type InsertProfileEntity = Omit<ProfileInsert, "id" | "createdAt" | "updatedAt">

/** プロフィールを挿入する（汎用） */
export const insertProfile = async ({db, entity}: {
  db: Db | Tx,
  entity: InsertProfileEntity
}) => {
  // プロフィールを挿入する
  const [newProfile] = await db.insert(profiles).values(entity).returning({ id: profiles.id })

  return {
    id: newProfile.id
  }
}

export type InsertParentProfileEntity = Omit<InsertProfileEntity, "type">

/** 親プロフィールを挿入する */
export const insertParentProfile = async ({db, entity}: {
  db: Db | Tx,
  entity: InsertParentProfileEntity
}) => {
  // プロフィールを挿入する
  const [newProfile] = await db.insert(profiles).values({
    type: "parent",
    ...entity
  }).returning({ id: profiles.id })

  return {
    id: newProfile.id
  }
}

export type InsertChildProfileEntity = Omit<InsertProfileEntity, "type">

/** 子プロフィールを挿入する */
export const insertChildProfile = async ({db, entity}: {
  db: Db | Tx,
  entity: InsertChildProfileEntity
}) => {
  // プロフィールを挿入する
  const [newProfile] = await db.insert(profiles).values({
    type: "child",
    ...entity
  }).returning({ id: profiles.id })

  return {
    id: newProfile.id
  }
}


/** プロフィールとユーザを紐づける */
export const linkProfileAndUser = async ({profileId, userId, supabase}: {
  profileId: string,
  userId: string,
  supabase: SupabaseClient
}) => {
  // 存在をチェックする
  const _ = await profileExclusiveControl.existsCheck({id: profileId, supabase})
  
  // プロフィールを更新する
  const {error} = await supabase.from('profiles')
    .update({user_id: userId})
    .eq('id', profileId)

  // エラーをチェックする
  if (error) {
    devLog("linkProfileAndUser.エラー: ", error)
    throw new DatabaseError(`更新時にエラーが発生しました。`, )
  }
}

// /** プロフィールを削除する */
// export const deleteProfile = async ({supabase, quest}: {
//   supabase: SupabaseClient, 
//   quest: ProfileDelete
// }) => {
//   // 存在をチェックする
//   const beforeProfile = await profileExclusiveControl.existsCheck({id: quest.id, supabase})
  
//   // 更新日時による排他制御を行う
//   profileExclusiveControl.hasAlreadyUpdated({
//     beforeDate: beforeProfile.updated_at, 
//     afterDate: quest.updated_at
//   })
  
//   const { error } = await supabase.rpc('delete_family_quest', {
//     _quest_id: quest.id
//   })

//   // エラーをチェックする
//   if (error) {
//     console.log(error)
//     throw new DatabaseError(`プロフィールの削除に失敗しました。`)
//   }
// }
