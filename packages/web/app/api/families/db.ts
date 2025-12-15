import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { FamilyEntity } from "./entity"
import { ProfileEntity } from "../users/entity"
import { devLog } from "@/app/(core)/util"

/** 家族と親を挿入する */
export const insertFamilyAndParent = async ({params, supabase}: {
  params: {
    _user_id: string,
    _display_id: FamilyEntity["display_id"],
    _local_name: FamilyEntity["local_name"],
    _online_name: FamilyEntity["online_name"],
    _family_icon_id: FamilyEntity["icon_id"],
    _family_icon_color: FamilyEntity["icon_color"],
    _family_invite_code: FamilyEntity["invite_code"],
    _parent_name: ProfileEntity["name"],
    _parent_icon_id: ProfileEntity["icon_id"],
    _parent_icon_color: ProfileEntity["icon_color"],
    _parent_birthday: ProfileEntity["birthday"],
  }
  supabase: SupabaseClient
}) => {
  // レコードを挿入する
  const { data, error } = await supabase.rpc("insert_family_and_parent", params)
  
  // エラーをチェックする
  if (error) {
    devLog("家族作成DBエラー: ", error)
    throw new DatabaseError('家族の作成に失敗しました。')
  }
}
