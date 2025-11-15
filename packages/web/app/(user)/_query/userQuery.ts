import { SortOrder } from "@/app/(core)/appSchema"
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"
import { UserColumns, UserFilterSchema, RawUser } from "../_schema/userSchema"
import { RawUserType } from "../_schema/userTypeSchema"

/** 検索条件に一致するユーザを取得する */
export const fetchUsers = async ({
  sortColumn,
  sortOrder,
  filter,
  page,
  pageSize
}: {
  sortColumn: UserColumns,
  sortOrder: SortOrder,
  filter: UserFilterSchema,
  page: number,
  pageSize: number
}) => {
    // データを取得する
    let query = clientSupabase.from("profiles").select('*', { count: 'exact' })

    // フィルター
    if (filter.name !== undefined) query = query.ilike("name", `%${filter.name}%`)
    query = query.eq('type_id', 2)

    // ソート
    query = query.order(sortColumn, {ascending: sortOrder === "asc"})

    // ページネーション
    query = query.range((page-1)*pageSize, page*pageSize-1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      users: data as RawUser[] ?? [],
      totalRecords: count
    }
}

/** UserIdに紐づくユーザを取得する */
export const fetchUser = async (userId?: string) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("profiles")
      .select('*')
      .eq("user_id", userId)

    // エラーをチェックする
    if (error) throw error

    if (!data || data.length === 0) {
      return undefined
    }

    return data[0] as RawUser
}


/** 全ユーザタイプを取得する */
export const fetchUserTypes = async () => {
  // データを取得する
  const { data, error } = await clientSupabase.from("profile_types")
    .select('*')

  // エラーをチェックする
  if (error) throw error

  return data as RawUserType[] ?? []
}
