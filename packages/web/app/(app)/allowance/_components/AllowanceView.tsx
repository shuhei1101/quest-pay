"use client"
import { AllowanceViewLayout } from "./AllowanceViewLayout"
import { useAgeRewardTable, useLevelRewardTable } from "../_hooks/useAllowance"

/** お小遣い閲覧画面 */
export const AllowanceView = () => {
  // データを取得する
  const { data: ageData, isLoading: isAgeLoading } = useAgeRewardTable()
  const { data: levelData, isLoading: isLevelLoading } = useLevelRewardTable()

  const isLoading = isAgeLoading || isLevelLoading

  // データが取得できるまで待つ
  if (!ageData || !levelData) {
    return <AllowanceViewLayout ageRewards={[]} levelRewards={[]} isLoading={true} />
  }

  return (
    <AllowanceViewLayout
      ageRewards={ageData.ageRewardTable.rewards}
      levelRewards={levelData.levelRewardTable.rewards}
      isLoading={isLoading}
    />
  )
}
