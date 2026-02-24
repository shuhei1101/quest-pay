"use client"
import { RewardViewLayout } from "./RewardViewLayout"
import { useAgeRewardTable, useLevelRewardTable } from "../_hooks/useReward"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { IconEdit } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { REWARD_URL } from "@/app/(core)/endpoints"

/** 報酬閲覧画面 */
export const RewardView = () => {
  const router = useRouter()
  
  // データを取得する
  const { data: ageData, isLoading: isAgeLoading } = useAgeRewardTable()
  const { data: levelData, isLoading: isLevelLoading } = useLevelRewardTable()

  const isLoading = isAgeLoading || isLevelLoading

  // データが取得できるまで待つ
  if (!ageData || !levelData || !ageData.ageRewardTable || !levelData.levelRewardTable) {
    return <RewardViewLayout ageRewards={[]} levelRewards={[]} isLoading={true} hideEditButton={true} />
  }

  return (
    <>
      <RewardViewLayout
        ageRewards={ageData.ageRewardTable.rewards}
        levelRewards={levelData.levelRewardTable.rewards}
        isLoading={isLoading}
        hideEditButton={true}
      />
      
      {/* 定額報酬設定FAB */}
      <SubMenuFAB
        items={[
          {
            icon: <IconEdit size={20} />,
            label: "編集",
            onClick: () => router.push(REWARD_URL),
            color: "violet"
          }
        ]}
      />
    </>
  )
}
