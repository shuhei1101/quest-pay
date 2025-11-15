import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"
import { RawInformation } from "../_schema/informationSchema"

/** お知らせを全件取得する */
export const fetchInformations = async () => {
    // データを取得する
    let query = clientSupabase.from("informations").select('*', { count: 'exact' })

    // ソート
    query = query.order('created_at', {ascending: false})

    const { data, error, count } = await query

    if (error) throw error

    return {
      informations: data as RawInformation[] ?? [],
      totalRecords: count
    }
}
