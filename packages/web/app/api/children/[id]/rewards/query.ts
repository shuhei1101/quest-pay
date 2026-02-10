import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { rewardHistories } from "@/drizzle/schema"
import { eq, and, gte, lte, sql } from "drizzle-orm"

/** 子供の報酬履歴を取得する */
export const fetchRewardHistories = async ({ db, childId, yearMonth }: {
  db: Db
  childId: string
  yearMonth?: string
}) => {
  try {
    let query = db
      .select()
      .from(rewardHistories)
      .where(eq(rewardHistories.childId, childId))

    if (yearMonth) {
      const [year, month] = yearMonth.split('-')
      const startDate = `${year}-${month}-01`
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]

      query = query.where(
        and(
          eq(rewardHistories.childId, childId),
          gte(rewardHistories.rewardedAt, startDate),
          lte(rewardHistories.rewardedAt, endDate + 'T23:59:59.999Z')
        )
      )
    }

    const data = await query.orderBy(rewardHistories.rewardedAt)

    devLog("fetchRewardHistories.取得データ: ", data, "app/api/children/[id]/rewards/query.ts")

    return data
  } catch (error) {
    devLog("fetchRewardHistories.取得例外: ", error, "app/api/children/[id]/rewards/query.ts")
    throw new QueryError("報酬履歴の読み込みに失敗しました。")
  }
}

/** 子供の報酬履歴の月別集計を取得する */
export const fetchRewardHistoryMonthlyStats = async ({ db, childId }: {
  db: Db
  childId: string
}) => {
  try {
    const data = await db
      .select({
        yearMonth: sql<string>`TO_CHAR(${rewardHistories.rewardedAt}, 'YYYY-MM')`,
        totalAmount: sql<number>`SUM(${rewardHistories.amount})::int`,
        totalExp: sql<number>`SUM(${rewardHistories.exp})::int`,
        count: sql<number>`COUNT(*)::int`,
        isPaid: sql<boolean>`BOOL_AND(${rewardHistories.isPaid})`,
      })
      .from(rewardHistories)
      .where(eq(rewardHistories.childId, childId))
      .groupBy(sql`TO_CHAR(${rewardHistories.rewardedAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${rewardHistories.rewardedAt}, 'YYYY-MM') DESC`)

    devLog("fetchRewardHistoryMonthlyStats.取得データ: ", data, "app/api/children/[id]/rewards/query.ts")

    return data
  } catch (error) {
    devLog("fetchRewardHistoryMonthlyStats.取得例外: ", error, "app/api/children/[id]/rewards/query.ts")
    throw new QueryError("月別報酬統計の読み込みに失敗しました。")
  }
}
