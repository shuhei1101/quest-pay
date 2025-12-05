import { z } from "zod"
import { SortOrder } from "@/app/(core)/schema"
import { ChildColumns, ChildEntity, ChildEntitySchema } from "../_schema/childEntity"
import { SupabaseClient } from "@supabase/supabase-js"

/** IDに紐づく子供を取得する */
export const fetchChild = async ({userId, supabase}:{
  userId: string,
  supabase: SupabaseClient
}) => {
  // データを取得する
  const { data, error } = await supabase.from("children")
    .select('*')
    .eq("user_id", userId)

  // エラーをチェックする
  if (error) throw error

  return data.length !== 0 ? ChildEntitySchema.parse(data[0]) : undefined
}

/** 検索条件に一致する子供を取得する */
export const fetchChildren = async ({
  sortColumn,
  sortOrder,
  page,
  pageSize,
  supabase
}: {
  sortColumn: ChildColumns,
  sortOrder: SortOrder,
  page: number,
  pageSize: number,
  supabase: SupabaseClient
}) => {
  // データを取得する
  let query = supabase.from("children")
    .select(`
        *,
        child_tags(*)
      `, { count: 'exact' })

  // ソート
  query = query.order(sortColumn, {ascending: sortOrder === "asc"})
  console.log(`query: ${JSON.stringify(query)}`)
  
  // ページネーション
  query = query.range((page-1)*pageSize, page*pageSize-1)
  
  // クエリを実行する
  const { data, error, count } = await query

  if (error) throw error

  return {
    children: z.array(ChildEntitySchema).parse(data),
    totalRecords: count
  }

}
