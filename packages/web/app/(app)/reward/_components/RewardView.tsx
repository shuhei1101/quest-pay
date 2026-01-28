"use client"
import { RewardViewLayout } from "./RewardViewLayout"
import { useAgeRewardTable, useLevelRewardTable } from "../_hooks/useReward"

/** 報酬閲覧画面 */
export const RewardView = () => {
  // データを取得する
  const { data: ageData, isLoading: isAgeLoading } = useAgeRewardTable()
  const { data: levelData, isLoading: isLevelLoading } = useLevelRewardTable()

  const isLoading = isAgeLoading || isLevelLoading

  // データが取得できるまで待つ
  if (!ageData || !levelData) {
    return <RewardViewLayout ageRewards={[]} levelRewards={[]} isLoading={true} />
  }

  return (
    <RewardViewLayout
      ageRewards={ageData.ageRewardTable.rewards}
      levelRewards={levelData.levelRewardTable.rewards}
      isLoading={isLoading}
    />
  )
}
