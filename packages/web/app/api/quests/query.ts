import { z } from "zod"
import { QuestTagEntitySchema } from "../../quests/_schema/questTagEntity";
import { SupabaseClient } from "@supabase/supabase-js";
import { QuestEntitySchema } from "./entity";
import { QuestSearchParams, QuestsGetResponse } from "./schema";

/** 取得結果の型 */
const FetchQuestResult = QuestEntitySchema.extend({
  quest_tags: z.array(QuestTagEntitySchema)
})

/** IDに紐づくクエストを取得する */
export const fetchQuest = async ({id, supabase}: {
  supabase: SupabaseClient,
  id: number
}) => {
  // データを取得する
  const { data, error } = await supabase.from("quests")
      .select(`
        *,
        quest_tags (*)
      `)
      .eq("id", id).single()

    // エラーをチェックする
    if (error) throw error;

    return FetchQuestResult.parse(data)
}


/** 取得結果の型 */
export const FetchQuestsResult = z.array(QuestEntitySchema.extend({
  quest_tags: z.array(QuestTagEntitySchema)
}))
