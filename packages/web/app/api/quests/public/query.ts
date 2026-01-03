import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { publicQuests, PublicQuestSelect, icons, IconSelect, questChildren, QuestChildrenSelect, QuestColumnSchema, questDetails, QuestDetailSelect, quests, QuestSelect, questTags, QuestTagSelect } from "@/drizzle/schema"
import { and, asc, count, desc, eq, inArray, like } from "drizzle-orm"
import z from "zod"
import { SortOrderScheme } from "@/app/(core)/schema"

/** 公開クエストフィルター */
export const PublicQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type PublicQuestFilterType = z.infer<typeof PublicQuestFilterScheme>

/** 公開クエスト検索パラメータ */
export const PublicQuestSearchParamsScheme = PublicQuestFilterScheme.extend({
  sortColumn: QuestColumnSchema,
  sortOrder: SortOrderScheme,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type PublicQuestSearchParams = z.infer<typeof PublicQuestSearchParamsScheme>

/** 公開クエスト取得結果 */
export type PublicQuest = {
  base: PublicQuestSelect
  quest: QuestSelect
  tags: QuestTagSelect[]
  details: QuestDetailSelect[]
  icon: IconSelect | null
}

/** クエリ結果をFetchPublicQuestsItemの配列に変換する */
const buildResult = (rows: {
  public_quests: PublicQuestSelect
  quests: QuestSelect
  quest_details?: QuestDetailSelect | null
  quest_tags?: QuestTagSelect | null
  icons: IconSelect | null
}[]): PublicQuest[] => {
  const map = new Map<string, PublicQuest>()

  for (const row of rows) {
    const publicQuestId = row.public_quests.id

    // mapを初期化する
    if (!map.has(publicQuestId)) {
      map.set(publicQuestId, {
        base: row.public_quests,
        quest: row.quests,
        tags: [],
        details: [],
        icon: row.icons
      })
    }

    // tagがあれば追加する
    if (row.quest_tags) map.get(publicQuestId)!.tags.push(row.quest_tags)
    // detailがあれば追加する
    if (row.quest_details) map.get(publicQuestId)!.details.push(row.quest_details)
  }

  return Array.from(map.values())
}

/** 検索条件に一致する公開クエストを取得する */
export const fetchPublicQuests = async ({ params, db }: {
  params: PublicQuestSearchParams,
  db: Db,
}) => {
  try {
    const { pageSize, offset } = calculatePagination({ page: params.page, pageSize: params.pageSize })
    const conditions = []

    if (params.name !== undefined) conditions.push(like(quests.name, `%${params.name}%`))
    if (params.tags.length !== 0) conditions.push(inArray(questTags.name, params.tags))

    // データを取得する
    const [rows, [{ total }]] = await Promise.all([
      db
      .select()
      .from(publicQuests)
      .innerJoin(quests, eq(publicQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .where(and(...conditions))
      .orderBy(params.sortOrder === "asc" ? 
        asc(quests[params.sortColumn]) :
        desc(quests[params.sortColumn])
      )
      .limit(pageSize)
      .offset(offset),
      db
      .select({ total: count() })
      .from(publicQuests)
      .where(and(...conditions))
    ])

    // データをオブジェクトに変換する
    const result = buildResult(rows)

    return {
      rows: result,
      totalRecords: total ?? 0
    }
  } catch (error) {
    devLog("fetchPublicQuests.取得例外: ", error)
    throw new QueryError("公開クエストの読み込みに失敗しました。")
  }
}

/** 公開クエストを取得する */
export const fetchPublicQuest = async ({id, db}: {
  id: PublicQuestSelect["id"],
  db: Db
}) => {
  try {
    // データを取得する
    const rows = await db
      .select()
      .from(publicQuests)
      .innerJoin(quests, eq(publicQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .where(eq(publicQuests.id, id))

    // データを結果オブジェクトに変換する
    const result = buildResult(rows)
    
    return result[0]
  } catch (error) {
    devLog("fetchPublicQuest.取得例外: ", error)
    throw new QueryError("公開クエストの読み込みに失敗しました。")
  }
}
