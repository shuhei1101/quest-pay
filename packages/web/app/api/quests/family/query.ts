import { calculatePagination, devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { familyQuests, FamilyQuestSelect, icons, questDetails, quests, questTags } from "@/drizzle/schema"
import { and, asc, count, desc, eq, inArray, like } from "drizzle-orm"
import { FamilyQuestSearchParams } from "./route"

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
      db.query.familyQuests.findMany({
        where: and(...conditions, eq(familyQuests.familyId, familyId)),
        with: {
          questChildren: {
            with: {
              children: true
            }
          },
          quest: {
            with: {
              details: true,
              tags: true,
              icon: true
            }
          }
        },
        orderBy: params.sortOrder === "asc" ?
          asc(quests[params.sortColumn]) :
          desc(quests[params.sortColumn]),
        limit: pageSize,
        offset: offset
      }),
      db
        .select({ total: count() })
        .from(familyQuests)
        .where(and(...conditions, eq(familyQuests.familyId, familyId)))
    ])

    return {
      quests: rows,
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
            children: true
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
