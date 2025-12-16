import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"
import { z } from "zod"
import { ProfileEntity } from "../users/entity"
import { ChildEntity } from "./entity"
import { FamilyEntity } from "../families/entity"

/** 子供を挿入する */
export const insertChild = async ({params, supabase}: {
  params: {
    _name: ProfileEntity["name"],
    _icon_id: ProfileEntity["icon_id"],
    _icon_color: ProfileEntity["icon_color"],
    _birthday: ProfileEntity["birthday"],
    _invite_code: ChildEntity["invite_code"],
    _family_id: FamilyEntity["id"],
  },
  supabase: SupabaseClient
}) => {

  // レコードを挿入する
  const { data, error } = await supabase.rpc("insert_child", params)
  
  // エラーをチェックする
  if (error) {
    devLog("insertChild.例外.ソース: ", {error, params})
    throw new DatabaseError('子供の作成に失敗しました。')
  }

  return z.string().parse(data)
}
