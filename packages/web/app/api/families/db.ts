import { DatabaseError } from "@/app/(core)/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { FamilyEntitySchema, FamilyInsert } from "./entity"
import { ProfileInsert } from "../users/entity"
import { devLog } from "@/app/(core)/util"

/** 家族を挿入する */
export const insertFamily = async ({userId, family, parent, supabase}: {
  userId: string,
  family: Pick<FamilyInsert, "display_id" | "local_name" | "online_name" | "icon_id" | "icon_color" | "invite_code">,
  parent: Pick<ProfileInsert, "name" | "icon_id" | "icon_color" | "birthday">,
  supabase: SupabaseClient
}) => {
  // レコードを挿入する
  const { data, error } = await supabase.rpc("insert_family_and_parent", {
    _user_id: userId,
    _display_id: family.display_id,
    _local_name: family.local_name,
    _online_name: family.online_name,
    _family_icon_id: family.icon_id,
    _family_icon_color: family.icon_color,
    _parent_name: parent.name,
    _parent_icon_id: parent.icon_id,
    _parent_icon_color: parent.icon_color,
    _parent_birthday: parent.birthday
  })
  
  // エラーをチェックする
  if (error) {
    devLog("家族作成DBエラー: ", error)
    throw new DatabaseError('家族の作成に失敗しました。')
  }
}
