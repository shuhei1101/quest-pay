"use client"
import { RewardViewLayout } from "@/app/(app)/reward/_components/RewardViewLayout"
import { useChildAgeRewardTable, useChildLevelRewardTable } from "../_hooks/useChildReward"

type Props = {
  childId: string
}

/** 子供個別の報酬閲覧画面 */
export const ChildRewardView = ({ childId }: Props) => {
  // データを取得する
  const { data: ageData, isLoading: isAgeLoading } = useChildAgeRewardTable(childId)
  const { data: levelData, isLoading: isLevelLoading } = useChildLevelRewardTable(childId)

  const isLoading = isAgeLoading || isLevelLoading

  // データが取得できるまで待つ
  if (!ageData || !levelData || !ageData.ageRewardTable || !levelData.levelRewardTable) {
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
