import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { ProfileUpdate } from "./entity"
import { devLog } from "@/app/(core)/util"
import { profileExclusiveControl } from "./dbHelper"

// /** プロフィールを挿入する */
// export const insertProfile = async ({profile, supabase}: {
//   profile: ProfileInsert
//   supabase: SupabaseClient
// }) => {
//   // レコードを挿入する
//   const { data, error } = await supabase.rpc("insert_family_quest", {
//     _name: quest.name,
//     _family_id: profile.family_id,
//     _is_public: profile.is_public,
//     _type: quest.type,
//     _icon_id: quest.icon_id,
//     _icon_color: quest.icon_color,
//     _tags: tags.map(t => t.name),
//     _category_id: quest.category_id
//   })
  
//   // エラーをチェックする
//   if (error) {
//     throw new DatabaseError('プロフィールの作成に失敗しました。')
//   }

//   const questId = ProfileEntitySchema.shape.quest_id.parse(data)

//   return questId
// }

/** プロフィールを更新する */
export const updateProfile = async ({profile, supabase}: {
  profile: ProfileUpdate
  supabase: SupabaseClient
}) => {
  // 存在をチェックする
  const beforeProfile = await profileExclusiveControl.existsCheck({id: profile.id, supabase})
  
  // 更新日時による排他制御を行う
  profileExclusiveControl.hasAlreadyUpdated({
    beforeDate: beforeProfile.updated_at, 
    afterDate: profile.updated_at
  })
  
  // プロフィールを更新する
  const {error} = await supabase.from('profiles')
    .update(profile)
    .eq('id', profile.id)

  // エラーをチェックする
  if (error) {
    devLog("家族プロフィール.更新エラー: ", error)
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
