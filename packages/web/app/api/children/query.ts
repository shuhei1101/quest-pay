import { logger } from "@/app/(core)/logger"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { 
  children, 
  icons, 
  profiles, 
  questChildren, 
  questDetails, 
  familyQuests,
  childAgeRewardTables,
  childLevelRewardTables,
  familyAgeRewardTables,
  familyLevelRewardTables,
  rewardByAges,
  rewardByLevels
} from "@/drizzle/schema"
import { eq, and, or, sql } from "drizzle-orm"
import dayjs from "dayjs"

/** 家族IDに一致する子供を取得する */
export const fetchChildrenByFamilyId = async ({ db, familyId }: {
  db: Db,
  familyId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .leftJoin(profiles, eq(children.profileId, profiles.id))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(profiles.familyId, familyId))

    logger.debug("子供一覧取得完了", { data, source: "app/api/children/query.ts" })

    return data
  } catch (error) {
    logger.error("子供一覧取得失敗", { error, source: "app/api/children/query.ts" })
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

export type Child = Awaited<ReturnType<typeof fetchChild>>

/** 子供IDに一致する子供を取得する */
export const fetchChild = async ({ db,  childId }: {
  db: Db,
  childId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .leftJoin(profiles, eq(children.profileId, profiles.id))
      .leftJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(children.id, childId))

    logger.debug("子供情報取得完了", { data })

    return data[0]
  } catch (error) {
    logger.error("子供情報取得失敗", { error, source: "app/api/children/query.ts" })
    throw new QueryError("子供情報の読み込みに失敗しました。")
  }
}

/** 招待コードに紐づく子供を取得する */
export const fetchChildByInviteCode = async ({db, invite_code}: {
  db: Db,
  invite_code: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(children)
      .where(eq(children.inviteCode, invite_code))


  return data[0]
  } catch (error) {
    logger.error("招待コード取得失敗", { error })
    throw new QueryError("招待コードの生成に失敗しました。", "app/api/children/query.ts")
  }
}

/** 子供のクエスト統計を取得する */
export const fetchChildQuestStats = async ({db, childId}: {
  db: Db,
  childId: string
}) => {
  try {
    // データを取得する
    const data = await db
      .select({
        inProgressCount: sql<number>`COUNT(CASE WHEN ${questChildren.status} IN ('in_progress', 'pending_review') THEN 1 END)::int`,
        completedCount: sql<number>`COUNT(CASE WHEN ${questChildren.status} = 'completed' THEN 1 END)::int`,
      })
      .from(questChildren)
      .where(eq(questChildren.childId, childId))

    logger.debug("子供クエスト統計取得完了", { data, source: "app/api/children/query.ts" })

    return data[0] ?? { inProgressCount: 0, completedCount: 0 }
  } catch (error) {
    logger.error("子供クエスト統計取得失敗", { error, source: "app/api/children/query.ts" })
    throw new QueryError("クエスト統計の読み込みに失敗しました。", "app/api/children/query.ts")
  }
}

/** 子供の報酬統計を取得する */
export const fetchChildRewardStats = async ({db, childId}: {
  db: Db,
  childId: string
}) => {
  try {
    // 今月の開始日を計算
    const currentMonth = dayjs().startOf('month').format('YYYY-MM-DD')
    
    // クエストの報酬統計を取得（完了したクエストのみ）
    const rewardData = await db
      .select({
        totalReward: sql<number>`COALESCE(SUM(${questDetails.reward}), 0)::int`,
        monthlyReward: sql<number>`COALESCE(SUM(CASE WHEN ${questChildren.statusUpdatedAt} >= ${currentMonth} THEN ${questDetails.reward} ELSE 0 END), 0)::int`,
      })
      .from(questChildren)
      .innerJoin(familyQuests, eq(questChildren.familyQuestId, familyQuests.id))
      .innerJoin(questDetails, and(
        eq(questDetails.questId, familyQuests.questId),
        eq(questDetails.level, questChildren.level)
      ))
      .where(and(
        eq(questChildren.childId, childId),
        eq(questChildren.status, 'completed')
      ))

    logger.debug("子供報酬統計取得完了", { rewardData, source: "app/api/children/query.ts" })

    const result = rewardData[0] ?? { totalReward: 0, monthlyReward: 0 }
    
    return {
      totalReward: result.totalReward,
      monthlyReward: result.monthlyReward,
    }
  } catch (error) {
    logger.error("子供報酬統計取得失敗", { error, source: "app/api/children/query.ts" })
    throw new QueryError("報酬統計の読み込みに失敗しました。", "app/api/children/query.ts")
  }
}

/** 子供の定額報酬を取得する（年齢別・レベル別） */
export const fetchChildFixedReward = async ({db, childId, age, level}: {
  db: Db,
  childId: string,
  age: number | null,
  level: number
}) => {
  try {
    let ageReward: number | null = null
    let levelReward: number | null = null

    // 年齢別報酬を取得（年齢が存在する場合のみ）
    if (age !== null) {
      // 子供個別の年齢別報酬テーブルを確認
      const childAgeRewardData = await db
        .select({
          amount: rewardByAges.amount
        })
        .from(childAgeRewardTables)
        .innerJoin(rewardByAges, and(
          eq(rewardByAges.type, 'child'),
          eq(rewardByAges.ageRewardTableId, childAgeRewardTables.id),
          eq(rewardByAges.age, age)
        ))
        .where(eq(childAgeRewardTables.childId, childId))
        .limit(1)

      if (childAgeRewardData.length > 0) {
        ageReward = childAgeRewardData[0].amount
      } else {
        // 子供個別の設定がない場合、家族の設定を取得
        // まず子供の家族IDを取得
        const childData = await fetchChild({db, childId})
        const familyId = childData?.profiles?.familyId

        if (familyId) {
          const familyAgeRewardData = await db
            .select({
              amount: rewardByAges.amount
            })
            .from(familyAgeRewardTables)
            .innerJoin(rewardByAges, and(
              eq(rewardByAges.type, 'family'),
              eq(rewardByAges.ageRewardTableId, familyAgeRewardTables.id),
              eq(rewardByAges.age, age)
            ))
            .where(eq(familyAgeRewardTables.familyId, familyId))
            .limit(1)

          if (familyAgeRewardData.length > 0) {
            ageReward = familyAgeRewardData[0].amount
          }
        }
      }
    }

    // レベル別報酬を取得
    // 子供個別のレベル別報酬テーブルを確認
    const childLevelRewardData = await db
      .select({
        amount: rewardByLevels.amount
      })
      .from(childLevelRewardTables)
      .innerJoin(rewardByLevels, and(
        eq(rewardByLevels.type, 'child'),
        eq(rewardByLevels.levelRewardTableId, childLevelRewardTables.id),
        eq(rewardByLevels.level, level)
      ))
      .where(eq(childLevelRewardTables.childId, childId))
      .limit(1)

    if (childLevelRewardData.length > 0) {
      levelReward = childLevelRewardData[0].amount
    } else {
      // 子供個別の設定がない場合、家族の設定を取得
      const childData = await fetchChild({db, childId})
      const familyId = childData?.profiles?.familyId

      if (familyId) {
        const familyLevelRewardData = await db
          .select({
            amount: rewardByLevels.amount
          })
          .from(familyLevelRewardTables)
          .innerJoin(rewardByLevels, and(
            eq(rewardByLevels.type, 'family'),
            eq(rewardByLevels.levelRewardTableId, familyLevelRewardTables.id),
            eq(rewardByLevels.level, level)
          ))
          .where(eq(familyLevelRewardTables.familyId, familyId))
          .limit(1)

        if (familyLevelRewardData.length > 0) {
          levelReward = familyLevelRewardData[0].amount
        }
      }
    }

    logger.debug("子供定額報酬取得完了", { ageReward, levelReward, source: "app/api/children/query.ts" })

    return {
      ageReward,
      levelReward,
      // 年齢別とレベル別の合計（どちらか存在する方、または両方の合計）
      totalFixedReward: (ageReward ?? 0) + (levelReward ?? 0)
    }
  } catch (error) {
    logger.error("子供定額報酬取得失敗", { error, source: "app/api/children/query.ts" })
    throw new QueryError("定額報酬の読み込みに失敗しました。", "app/api/children/query.ts")
  }
}
