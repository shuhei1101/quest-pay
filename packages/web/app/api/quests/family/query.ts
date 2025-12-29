import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { familyQuests, FamilyQuestSelect, icons, IconSelect, questDetails, QuestDetailSelect, quests, QuestSelect, questTags, QuestTagSelect } from "@/drizzle/schema"
import { and, asc, count, desc, eq, inArray, like } from "drizzle-orm"
import { FamilyQuestSearchParams } from "./route"

export type FamilyQuests = Awaited<ReturnType<typeof fetchFamilyQuests>>

export type FetchFamilyQuestsItem = {
  familyQuest: FamilyQuestSelect
  quest: QuestSelect
  tags: QuestTagSelect[]
  details: QuestDetailSelect[]
  icon: IconSelect | null
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
      .leftJoin(questDetails, eq(questDetails.questId, quests.id))
      .leftJoin(questTags, eq(questTags.questId, quests.id))
      .leftJoin(icons, eq(quests.iconId, icons.id))
      .where(and(...conditions, eq(familyQuests.familyId, familyId)))
    ])

  const map = new Map<string, FetchFamilyQuestsItem>()

  for (const row of rows) {
    const fqId = row.family_quests.id

    // mapを初期化する
    if (!map.has(fqId)) {
      map.set(fqId, {
        familyQuest: row.family_quests,
        quest: row.quests,
        tags: [],
        details: [],
        icon: row.icons
      })
    }

    // tagがあれば追加する
    if (row.quest_tags)  map.get(fqId)!.tags.push(row.quest_tags)
    // detailがあれば追加する
    if (row.quest_details) map.get(fqId)!.details.push(row.quest_details)
  }

  const result: FetchFamilyQuestsItem[] = Array.from(map.values())

    return {
      rows: result,
      totalRecords: total ?? 0
    }
  } catch (error) {
    devLog("fetchFamilyQuests.取得例外: ", error)
    throw new QueryError("家族クエストの読み込みに失敗しました。")
  }
}

export type FamilyQuest = Awaited<ReturnType<typeof fetchFamilyQuest>>

/** 家族クエストを取得する */
export const fetchFamilyQuest = async ({id, db}: {
  id: FamilyQuestSelect["id"],
  db: Db
}) => {
  try {
    // データを取得する
    const data = await db.query.familyQuests.findMany({
      where: eq(familyQuests.id, id),
      with: {
        questChildren: {
          with: {
            child: true
          }
        },
        quest: {
          with: {
            details: true,
            tags: true,
            icon: true
          }
        }
      }
    })

    return data[0]
  } catch (error) {
    devLog("fetchFamilyQuest.取得例外: ", error)
    throw new QueryError("ユーザ情報の読み込みに失敗しました。")
  }
}
