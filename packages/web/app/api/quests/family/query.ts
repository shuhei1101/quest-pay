import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { familyQuests, FamilyQuestSelect, icons, IconSelect, questChildren, QuestChildrenSelect, QuestColumnSchema, questDetails, QuestDetailSelect, quests, QuestSelect, questTags, QuestTagSelect } from "@/drizzle/schema"
import { and, asc, count, desc, eq, inArray, like } from "drizzle-orm"
import z from "zod"
import { SortOrderScheme } from "@/app/(core)/schema"

/** 家族クエストフィルター */
export const FamilyQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
})
export type FamilyQuestFilterType = z.infer<typeof FamilyQuestFilterScheme>

/** 家族クエスト検索パラメータ */
export const FamilyQuestSearchParamsScheme = FamilyQuestFilterScheme.extend({
  sortColumn: QuestColumnSchema,
  sortOrder: SortOrderScheme,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type FamilyQuestSearchParams = z.infer<typeof FamilyQuestSearchParamsScheme>

/** 家族クエスト取得結果 */
export type FamilyQuest = {
  base: FamilyQuestSelect
  quest: QuestSelect
  tags: QuestTagSelect[]
  details: QuestDetailSelect[]
  icon: IconSelect | null
  children: QuestChildrenSelect[]
}

/** クエリ結果をFetchFamilyQuestsItemの配列に変換する */
const buildResult = (rows: {
  family_quests: FamilyQuestSelect
  quests: QuestSelect
  quest_details?: QuestDetailSelect | null
  quest_children?: QuestChildrenSelect | null
  quest_tags?: QuestTagSelect | null
  icons: IconSelect | null
}[]): FamilyQuest[] => {
  const map = new Map<string, FamilyQuest>()

  for (const row of rows) {
    const familyQuestId = row.family_quests.id

    // mapを初期化する
    if (!map.has(familyQuestId)) {
      map.set(familyQuestId, {
        base: row.family_quests,
        quest: row.quests,
        tags: [],
        details: [],
        children: [],
        icon: row.icons
      })
    }

    // tagがあれば追加する
    if (row.quest_tags && !map.get(familyQuestId)!.tags.some(tag => tag.id === row.quest_tags!.id)) map.get(familyQuestId)!.tags.push(row.quest_tags)
    // detailがあれば追加する
    if (row.quest_details && !map.get(familyQuestId)!.details.some(detail => detail.id === row.quest_details!.id)) map.get(familyQuestId)!.details.push(row.quest_details)
    // childがあれば追加する
    if (row.quest_children && !map.get(familyQuestId)!.children.some(child => child.id === row.quest_children!.id)) map.get(familyQuestId)!.children.push(row.quest_children)
  }

  return Array.from(map.values())
}

/** 検索条件に一致する家族クエストを取得する */
export const fetchFamilyQuests = async ({ params, db, familyId }: {
  params: FamilyQuestSearchParams,
  db: Db,
  familyId: string
}) => {
  try {
    const { pageSize, offset } = calculatePagination({ page: params.page, pageSize: params.pageSize })
    const conditions = []

    if (params.name !== undefined) conditions.push(like(quests.name, `%${params.name}%`))
    if (params.tags.length !== 0) conditions.push(inArray(questTags.name, params.tags))
    if (params.categoryId !== undefined) {
      if (params.categoryId === "null") {
        conditions.push(eq(quests.categoryId, null))
      } else {
        conditions.push(eq(quests.categoryId, params.categoryId))
      }
    }

    // データを取得する
    const [rows, [{ total }]] = await Promise.all([
      db
      .select()
      .from(familyQuests)
      .innerJoin(quests, eq(familyQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .where(and(...conditions, eq(familyQuests.familyId, familyId)))
      .orderBy(params.sortOrder === "asc" ? 
        asc(quests[params.sortColumn]) :
        desc(quests[params.sortColumn])
      )
      .limit(pageSize)
      .offset(offset),
      db
      .select({ total: count() })
      .from(familyQuests)
      .innerJoin(quests, eq(familyQuests.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .where(and(...conditions, eq(familyQuests.familyId, familyId)))
    ])

    // データをオブジェクトに変換する
    const result = buildResult(rows)

    return {
      rows: result,
      totalRecords: total ?? 0
    }
  } catch (error) {
    devLog("fetchFamilyQuests.取得例外: ", error)
    throw new QueryError("家族クエストの読み込みに失敗しました。")
  }
}

/** 家族クエストを取得する */
export const fetchFamilyQuest = async ({id, db}: {
  id: FamilyQuestSelect["id"],
  db: Db
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
      .where(eq(familyQuests.id, id))

    // データを結果オブジェクトに変換する
    const result = buildResult(rows)
    
    return result[0]
  } catch (error) {
    devLog("fetchFamilyQuest.取得例外: ", error)
    throw new QueryError("家族クエストの読み込みに失敗しました。")
  }
}
