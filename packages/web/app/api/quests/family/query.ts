import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod"
import { FamilyQuestViewSchema } from "./view";
import { QuestTagEntitySchema } from "@/app/(app)/quests/_schema/questTagEntity";
import { FamilyQuestSearchParams, QuestsFamilyGetResponse } from "./schema";
import { devLog } from "@/app/(core)/util";

/** 取得結果の型 */
export const FetchFamilyQuestsResult = z.array(FamilyQuestViewSchema.extend({
  quest_tags: z.array(QuestTagEntitySchema)
}))

/** 検索条件に一致するクエストを取得する */
export const fetchFamilyQuests = async ({
  params,
  supabase,
  familyId,
}: {
  params: FamilyQuestSearchParams,
  supabase: SupabaseClient,
  familyId: number
}) => {

  // データを取得する
  let query = supabase.from("family_quest_view")
    .select(`
        *,
        quest_tags (*)
      `, { count: 'exact' })

    // フィルター
    if (params.name !== undefined) query = query.ilike("name", `%${params.name}%`)
    if (params.tags.length !== 0) query = query.in("quest_tags.name", params.tags)
    query = query.eq("family_id", familyId) // 家族IDに一致するクエストを取得する
    
    // ソート
    query = query.order(params.sortColumn, {ascending: params.sortOrder === "asc"})
    
    // ページネーション
    query = query.range((params.page-1)*params.pageSize, params.page*params.pageSize-1)
    
    // クエリを実行する
    const { data, error, count } = await query

    if (error) throw error

    const fetchedQuests = FetchFamilyQuestsResult.parse(data ?? [])

    // 指定タグに完全一致しているクエストを絞り込む
    const questsWithAllTags = fetchedQuests.filter(quest =>
      params.tags.every(tag => quest.quest_tags.some(t => t.name === tag))
    )

    return {
      quests: questsWithAllTags ?? [],
      totalRecords: count ?? 0
    } as QuestsFamilyGetResponse
}

export const FetchFamilyQuestResult = FamilyQuestViewSchema.extend({
  quest_tags: z.array(QuestTagEntitySchema)
})

/** 検索条件に一致するクエストを取得する */
export const fetchFamilyQuest = async ({
  supabase,
  questId
}: {
  supabase: SupabaseClient,
  questId: number
}) => {

  // データを取得する
  const { data, error } = await supabase.from("family_quest_view")
    .select(`
        *,
        quest_tags (*)
      `, { count: 'exact' })
    .eq("id", questId)

    if (error) throw error

    devLog("fetchFamilyQuest.取得データ: ", data)

    return data.length > 0 ? FetchFamilyQuestResult.parse(data[0]) : undefined
}
