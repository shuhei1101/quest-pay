import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { templateQuests, TemplateQuestSelect, icons, IconSelect, questChildren, QuestChildrenSelect, QuestColumnSchema, questDetails, QuestDetailSelect, quests, QuestSelect, questTags, QuestTagSelect, familyQuests, FamilyQuestSelect, FamilyInsert, FamilySelect, families, publicQuests, PublicQuestSelect } from "@/drizzle/schema"
import { and, asc, count, desc, eq, inArray, isNull, like } from "drizzle-orm"
import z from "zod"
import { SortOrderScheme } from "@/app/(core)/schema"

/** テンプレートクエストフィルター */
export const TemplateQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
})
export type TemplateQuestFilterType = z.infer<typeof TemplateQuestFilterScheme>

/** テンプレートクエスト検索パラメータ */
export const TemplateQuestSearchParamsScheme = TemplateQuestFilterScheme.extend({
  sortColumn: QuestColumnSchema,
  sortOrder: SortOrderScheme,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type TemplateQuestSearchParams = z.infer<typeof TemplateQuestSearchParamsScheme>

/** テンプレートクエスト取得結果 */
export type TemplateQuest = {
  base: TemplateQuestSelect
  quest: QuestSelect
  tags: QuestTagSelect[]
  details: QuestDetailSelect[]
  icon?: IconSelect
  publicQuest?: PublicQuestSelect
  family?: FamilySelect
  familyIcon?: IconSelect
}

/** クエリ結果をFetchTemplateQuestsItemの配列に変換する */
const buildResult = (rows: {
  template_quests: TemplateQuestSelect
  quests: QuestSelect
  quest_details?: QuestDetailSelect | null
  quest_tags?: QuestTagSelect | null
  icons: IconSelect | null
  public_quests?: PublicQuestSelect | null
  families?: FamilySelect | null
  family_icons?: IconSelect | null
}[]): TemplateQuest[] => {
  const map = new Map<string, TemplateQuest>()

  for (const row of rows) {
    const templateQuestId = row.template_quests.id

    // mapを初期化する
    if (!map.has(templateQuestId)) {
      map.set(templateQuestId, {
        base: row.template_quests,
        quest: row.quests,
        tags: [],
        details: [],
        icon: row.icons || undefined,
        publicQuest: row.public_quests || undefined,
        family: row.families || undefined,
        familyIcon: row.family_icons || undefined
      })
    }

    // tagがあれば追加する
    if (row.quest_tags && !map.get(templateQuestId)!.tags.some(tag => tag.id === row.quest_tags!.id)) map.get(templateQuestId)!.tags.push(row.quest_tags)
    // detailがあれば追加する
    if (row.quest_details && !map.get(templateQuestId)!.details.some(detail => detail.id === row.quest_details!.id)) map.get(templateQuestId)!.details.push(row.quest_details)
  }

  return Array.from(map.values())
}

/** 検索条件に一致するテンプレートクエストを取得する */
export const fetchTemplateQuests = async ({ params, db, familyId }: {
  params: TemplateQuestSearchParams,
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
        conditions.push(isNull(quests.categoryId))
      } else {
        conditions.push(eq(quests.categoryId, parseInt(params.categoryId)))
      }
    }

    // データを取得する
    const [rows, [{ total }]] = await Promise.all([
      db
      .select()
      .from(templateQuests)
      .innerJoin(quests, eq(templateQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      
      .where(and(...conditions, eq(templateQuests.familyId, familyId)))
      .orderBy(params.sortOrder === "asc" ? 
        asc(quests[params.sortColumn]) :
        desc(quests[params.sortColumn])
      )
      .limit(pageSize)
      .offset(offset),
      db
      .select({ total: count() })
      .from(templateQuests)
      .innerJoin(quests, eq(templateQuests.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .where(and(...conditions, eq(templateQuests.familyId, familyId)))
    ])

    // データをオブジェクトに変換する
    const result = buildResult(rows)

    devLog("fetchTemplateQuests.取得データ: ", result)

    return {
      rows: result,
      totalRecords: total ?? 0
    }
  } catch (error) {
    devLog("fetchTemplateQuests.取得例外: ", error)
    throw new QueryError("テンプレートクエストの読み込みに失敗しました。")
  }
}

/** テンプレートクエストを取得する */
export const fetchTemplateQuest = async ({id, db}: {
  id: TemplateQuestSelect["id"],
  db: Db
}) => {
  try {

    // データを取得する
    const rows = await db
      .select()
      .from(templateQuests)
      .innerJoin(quests, eq(templateQuests.questId, quests.id))
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .leftJoin(publicQuests, eq(publicQuests.id, templateQuests.publicQuestId))
      .where(eq(templateQuests.id, id))

    // データを結果オブジェクトに変換する
    const result = buildResult(rows)

    devLog("fetchTemplateQuest.取得データ: ", result)

    return result[0]
  } catch (error) {
    devLog("fetchTemplateQuest.取得例外: ", error)
    throw new QueryError("テンプレートクエストの読み込みに失敗しました。")
  }
}

/** 公開クエストIDからテンプレートクエストを取得する */
export const fetchTemplateQuestByPublicQuestId = async ({publicQuestId, db, familyId}: {
  publicQuestId: PublicQuestSelect["id"],
  db: Db,
  familyId: string
}) => {
  try {
    // データを取得する
    const rows = await db
      .select()
      .from(templateQuests)
      .innerJoin(quests, eq(templateQuests.questId, quests.id))
      .where(and(
        eq(templateQuests.publicQuestId, publicQuestId), 
        eq(templateQuests.familyId, familyId)
      ))

    devLog("fetchTemplateQuestByPublicQuestId.取得データ: ", rows)

    return rows[0]
  } catch (error) {
    devLog("fetchTemplateQuestByPublicQuestId.取得例外: ", error)
    throw new QueryError("テンプレートクエストの読み込みに失敗しました。")
  }
}

/** 特定公開クエストIDのテンプレートクエスト登録数を取得する */
export const fetchQuestLikeCount = async ({publicQuestId, db}: {
  publicQuestId: PublicQuestSelect["id"],
  db: Db
}) => {
  try {
    // データを取得する
    const [{ total }] = await db
      .select({ total: count() })
      .from(templateQuests)
      .where(eq(templateQuests.publicQuestId, publicQuestId))

    devLog("fetchQuestLikeCount.取得データ: ", total)

    return total
  } catch (error) {
    devLog("fetchQuestLikeCount.取得例外: ", error)
    throw new QueryError("クエストいいね数の読み込みに失敗しました。")
  }
}
