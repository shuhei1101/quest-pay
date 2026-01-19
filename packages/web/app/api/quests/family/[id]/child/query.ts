import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { familyQuests, icons, IconSelect, questChildren, QuestColumnSchema, questDetails, QuestDetailSelect, quests, QuestSelect, questTags, QuestTagSelect, ChildSelect, FamilyQuestSelect, QuestChildrenSelect } from "@/drizzle/schema"
import { and, asc, count, countDistinct, desc, eq, inArray, like } from "drizzle-orm"
import z from "zod"
import { SortOrderScheme } from "@/app/(core)/schema"

/** 子供クエストフィルター */
export const ChildQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type ChildQuestFilterType = z.infer<typeof ChildQuestFilterScheme>

/** 子供クエスト検索パラメータ */
export const ChildQuestSearchParamsScheme = ChildQuestFilterScheme.extend({
  sortColumn: QuestColumnSchema,
  sortOrder: SortOrderScheme,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type ChildQuestSearchParams = z.infer<typeof ChildQuestSearchParamsScheme>

/** 子供クエスト取得結果 */
export type ChildQuest = {
  base: FamilyQuestSelect
  quest: QuestSelect
  tags: QuestTagSelect[]
  details: QuestDetailSelect[]
  icon: IconSelect | null
  children: QuestChildrenSelect[]
}

/** クエリ結果をFetchChildQuestsItemの配列に変換する */
const buildResult = (rows: {
  family_quests: FamilyQuestSelect
  quests: QuestSelect
  quest_details?: QuestDetailSelect | null
  quest_tags?: QuestTagSelect | null
  icons: IconSelect | null
  quest_children: QuestChildrenSelect | null
}[]): ChildQuest[] => {
  const map = new Map<string, ChildQuest>()

  for (const row of rows) {
    const childQuestId = row.family_quests.id

    // mapを初期化する
    if (!map.has(childQuestId)) {
      map.set(childQuestId, {
        base: row.family_quests,
        quest: row.quests,
        tags: [],
        details: [],
        icon: row.icons,
        children: [],
      })
    }

    // tagがあれば追加する
    if (row.quest_tags && !map.get(childQuestId)!.tags.some(tag => tag.id === row.quest_tags!.id)) map.get(childQuestId)!.tags.push(row.quest_tags)
    // detailがあれば追加する
    if (row.quest_details && !map.get(childQuestId)!.details.some(detail => detail.id === row.quest_details!.id)) map.get(childQuestId)!.details.push(row.quest_details)
    // questChildrenがあれば追加する
    if (row.quest_children && !map.get(childQuestId)!.children.some(qc => qc.id === row.quest_children!.id)) map.get(childQuestId)!.children.push(row.quest_children)
  }

  return Array.from(map.values())
}

/** 検索条件に一致する子供クエストを取得する */
export const fetchChildQuests = async ({ params, db, childId, familyId }: {
  params: ChildQuestSearchParams,
  db: Db,
  childId: string,
  familyId: string
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
      .from(familyQuests)
      .innerJoin(quests, eq(familyQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(questChildren, eq(questChildren.familyQuestId, familyQuests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .where(and(...conditions, eq(questChildren.childId, childId), eq(familyQuests.familyId, familyId), eq(questChildren.isActivate, true)))
      .orderBy(params.sortOrder === "asc" ? 
        asc(quests[params.sortColumn]) :
        desc(quests[params.sortColumn])
      )
      .limit(pageSize)
      .offset(offset),
      db
      .select({ total: countDistinct(familyQuests.id) })
      .from(familyQuests)
      .innerJoin(quests, eq(familyQuests.questId, quests.id))
      .leftJoin(questChildren, eq(questChildren.familyQuestId, familyQuests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .where(and(...conditions, eq(questChildren.childId, childId), eq(familyQuests.familyId, familyId), eq(questChildren.isActivate, true)))
    ])

    // データをオブジェクトに変換する
    const result = buildResult(rows)

    devLog("fetchChildQuests.取得結果: ", result)

    return {
      rows: result,
      totalRecords: total ?? 0
    }
  } catch (error) {
    devLog("fetchChildQuests.取得例外: ", error)
    throw new QueryError("子供クエストの読み込みに失敗しました。")
  }
}

/** 子供クエストを取得する */
export const fetchChildQuest = async ({familyQuestId, db, childId}: {
  familyQuestId: FamilyQuestSelect["id"],
  db: Db,
  childId: ChildSelect["id"]
}) => {
  try {
    // データを取得する
    const rows = await db
      .select()
      .from(familyQuests)
      .innerJoin(quests, eq(familyQuests.questId, quests.id))
      .leftJoin(questChildren, eq(questChildren.familyQuestId, familyQuests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .where(and(eq(familyQuests.id, familyQuestId), eq(questChildren.childId, childId)))

    // データを結果オブジェクトに変換する
    const result = buildResult(rows)
    
    return result[0]
  } catch (error) {
    devLog("fetchChildQuest.取得例外: ", error)
    throw new QueryError("子供クエストの読み込みに失敗しました。")
  }
}
