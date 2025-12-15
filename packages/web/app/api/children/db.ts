import { DatabaseError } from "@/app/(core)/error/appError"
import { SupabaseClient } from "@supabase/supabase-js"
import { devLog } from "@/app/(core)/util"
import { z } from "zod"

/** 子供を挿入する */
export const insertChild = async ({params, supabase}: {
  params: {
    _name: string,
    _icon_id: number,
    _icon_color: string,
    _birthday: string,
    _invite_code: string,
    _family_id: string,
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
