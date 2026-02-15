import { rewardHistories, RewardHistoryInsert } from "@/drizzle/schema"
import { Db } from "@/index"
import { and, eq, gte, lte, sql } from "drizzle-orm"

/** 報酬履歴を挿入する */
export const insertRewardHistory = async ({
  db,
  record
}: {
  db: Db
  record: RewardHistoryInsert
}) => {
  const [newRecord] = await db
    .insert(rewardHistories)
    .values(record)
    .returning({ id: rewardHistories.id })

  return {
    id: newRecord.id
  }
}

/** 指定月の報酬履歴の支払い状態を更新する */
export const updateRewardHistoriesPaymentStatus = async ({
  db,
  childId,
  yearMonth,
  isPaid,
  paidAt
}: {
  db: Db
  childId: string
  yearMonth: string
  isPaid: boolean
  paidAt?: string | null
}) => {
  const [year, month] = yearMonth.split('-')
  const startDate = `${year}-${month.padStart(2, '0')}-01`
  const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1
  const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year)
  const endDate = new Date(nextYear, nextMonth - 1, 0).toISOString().split('T')[0]

  await db
    .update(rewardHistories)
    .set({
      isPaid,
      paidAt,
      updatedAt: new Date().toISOString()
    })
    .where(
      and(
        eq(rewardHistories.childId, childId),
        gte(rewardHistories.rewardedAt, startDate),
        lte(rewardHistories.rewardedAt, endDate + 'T23:59:59.999Z')
      )
    )
}
