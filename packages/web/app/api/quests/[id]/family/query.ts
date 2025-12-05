import { z } from "zod"
import { SupabaseClient } from "@supabase/supabase-js";
import { QuestTagEntitySchema } from "@/app/quests/_schema/questTagEntity";
import { FamilyQuestViewSchema } from "../../family/view";
import { FamilyQuestGetResponse } from "./schema";


/** 取得結果の型 */
export const FetchFamilyQuestResult = z.array(FamilyQuestViewSchema.extend({
  quest_tags: z.array(QuestTagEntitySchema)
}))

/** 検索条件に一致するクエストを取得する */
export const fetchFamilyQuest = async ({
  supabase,
  questId
}: {
  supabase: SupabaseClient,
  questId: number
}) => {

  // データを取得する
  const { data, error, count } = await supabase.from("family_quest_view")
    .select(`
        *,
        quest_tags (*)
      `, { count: 'exact' })
    .eq("quest_id", questId)

    if (error) throw error

    return {
      quests: FetchFamilyQuestResult.parse(data ?? []),
    } as FamilyQuestGetResponse
}
