import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { publicQuests, PublicQuestSelect, icons, IconSelect, questChildren, QuestChildrenSelect, QuestColumnSchema, questDetails, QuestDetailSelect, quests, QuestSelect, questTags, QuestTagSelect, familyQuests, FamilyQuestSelect, FamilyInsert, FamilySelect, families } from "@/drizzle/schema"
import { and, asc, count, desc, eq, inArray, isNull, like, or } from "drizzle-orm"
import z from "zod"
import { SortOrderScheme } from "@/app/(core)/schema"
import { alias } from "drizzle-orm/pg-core"

/** 公開クエストフィルター */
export const PublicQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
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
  icon?: IconSelect
  familyQuest?: FamilyQuestSelect
  family?: FamilySelect
  familyIcon?: IconSelect
}

/** クエリ結果をFetchPublicQuestsItemの配列に変換する */
const buildResult = (rows: {
  public_quests: PublicQuestSelect
  quests: QuestSelect
  quest_details?: QuestDetailSelect | null
  quest_tags?: QuestTagSelect | null
  icons: IconSelect | null
  family_quests?: FamilyQuestSelect | null
  families?: FamilySelect | null
  family_icons?: IconSelect | null
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
        icon: row.icons || undefined,
        familyQuest: row.family_quests || undefined,
        family: row.families || undefined,
        familyIcon: row.family_icons || undefined
      })
    }

    // tagがあれば追加する
    if (row.quest_tags && !map.get(publicQuestId)!.tags.some(tag => tag.id === row.quest_tags!.id)) map.get(publicQuestId)!.tags.push(row.quest_tags)
    // detailがあれば追加する
    if (row.quest_details && !map.get(publicQuestId)!.details.some(detail => detail.id === row.quest_details!.id)) map.get(publicQuestId)!.details.push(row.quest_details)
  }

  return Array.from(map.values())
}

/** 検索条件に一致する公開クエストを取得する */
export const fetchPublicQuests = async ({ params, db, familyId }: {
  params: PublicQuestSearchParams,
  db: Db,
  familyId?: FamilySelect["id"]
}) => {
  try {

    devLog("fetchPublicQuests.検索パラメータ: ", params)
    const { pageSize, offset } = calculatePagination({ page: params.page, pageSize: params.pageSize })
    const conditions = []
    const familyIcons = alias(icons, "family_icons")

    if (params.name !== undefined) conditions.push(like(quests.name, `%${params.name}%`))
    if (params.tags.length !== 0) conditions.push(inArray(questTags.name, params.tags))
    if (params.categoryId !== undefined) {
      if (params.categoryId === "null") {
        conditions.push(isNull(quests.categoryId))
      } else {
        conditions.push(eq(quests.categoryId, parseInt(params.categoryId)))
      }
    }
    conditions.push(familyId 
          ? or(
              eq(publicQuests.isActivate, true),
              eq(publicQuests.familyId, familyId)
            )
          : eq(publicQuests.isActivate, true)
    )

    // 先に公開クエストのIDを取得する
    const publicQuestIds = await db
      .select({ id: publicQuests.id })
      .from(publicQuests)
      .innerJoin(quests, eq(publicQuests.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .where(and(...conditions))
      .orderBy(params.sortOrder === "asc" ? 
        asc(quests[params.sortColumn]) :
        desc(quests[params.sortColumn])
      )
      .limit(pageSize)
      .offset(offset)

    // データを取得する
    const [rows, [{ total }]] = await Promise.all([
      publicQuestIds.length > 0 
        ? db
          .select()
          .from(publicQuests)
          .innerJoin(quests, eq(publicQuests.questId, quests.id))
          .leftJoin(questDetails, eq(questDetails.questId, quests.id))
          .leftJoin(questTags, eq(questTags.questId, quests.id))
          .leftJoin(icons, eq(quests.iconId, icons.id))
          .leftJoin(familyQuests, eq(familyQuests.id, publicQuests.familyQuestId))
          .leftJoin(families, eq(families.id, familyQuests.familyId))
          .leftJoin(familyIcons, eq(families.iconId, familyIcons.id))
          .where(inArray(publicQuests.id, publicQuestIds.map(pq => pq.id)))
          .orderBy(params.sortOrder === "asc" ? 
            asc(quests[params.sortColumn]) :
            desc(quests[params.sortColumn])
          )
        : Promise.resolve([]),
      db
        .select({ total: count() })
        .from(publicQuests)
        .innerJoin(quests, eq(publicQuests.questId, quests.id))
        .leftJoin(questTags, eq(questTags.questId, quests.id))
        .where(and(...conditions))
    ])

    devLog("fetchPublicQuests.生クエリ結果件数: ", rows.length)
    devLog("fetchPublicQuests.familyId: ", familyId)
    devLog("fetchPublicQuests.conditions: ", conditions.length)
    devLog("fetchPublicQuests.total: ", total)

    // データをオブジェクトに変換する
    const result = buildResult(rows)

    devLog("fetchPublicQuests.取得データ: ", result)

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

    const familyIcons = alias(icons, "family_icons")

    // データを取得する
    const rows = await db
      .select()
      .from(publicQuests)
      .innerJoin(quests, eq(publicQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .leftJoin(familyQuests, eq(familyQuests.id, publicQuests.familyQuestId))
      .leftJoin(families, eq(families.id, familyQuests.familyId))
      .leftJoin(familyIcons, eq(families.iconId, familyIcons.id))
      .where(eq(publicQuests.id, id))

    // データを結果オブジェクトに変換する
    const result = buildResult(rows)

    devLog("fetchPublicQuest.取得データ: ", result)

    return result[0]
  } catch (error) {
    devLog("fetchPublicQuest.取得例外: ", error)
    throw new QueryError("公開クエストの読み込みに失敗しました。")
  }
}

/** 家族IDから公開クエストを取得する */
export const fetchPublicQuestByFamilyId = async ({db, familyQuestId}: {
  db: Db,
  familyQuestId: FamilyQuestSelect["id"]
}) => {
  try {

    const familyIcons = alias(icons, "family_icons")

    // データを取得する
    const rows = await db
      .select()
      .from(publicQuests)
      .where(eq(publicQuests.familyQuestId, familyQuestId))

    devLog("fetchPublicQuest.取得データ: ", rows)

    return rows[0]
  } catch (error) {
    devLog("fetchPublicQuest.取得例外: ", error)
    throw new QueryError("公開クエストの読み込みに失敗しました。")
  }
}
