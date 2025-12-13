import { DatabaseError } from "@/app/(core)/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { ProfileEntity, ProfileInsert } from "../users/entity"
import { devLog } from "@/app/(core)/util"
import { ChildEntity } from "./entity"
import { z } from "zod"

/** 子供を挿入する */
export const insertChild = async ({profile, child, supabase, familyId}: {
  profile: Pick<ProfileEntity, "name" | "icon_id" | "icon_color" | "birthday">,
  child: Pick<ChildEntity, "invite_code">,
  familyId: string
  supabase: SupabaseClient
}) => {

    devLog("insertChild.家族データ: ", {profile, child})

  // レコードを挿入する
  const { data, error } = await supabase.rpc("insert_child", {
    _name: profile.name,
    _icon_id: profile.icon_id,
    _icon_color: profile.icon_color,
    _birthday: profile.birthday,
    _invite_code: child.invite_code,
    _family_id: familyId,
  })
  
  // エラーをチェックする
  if (error) {
    devLog("子供作成DBエラー: ", error)
    throw new DatabaseError('子供の作成に失敗しました。')
  }
  
  return z.string().parse(data)
}
