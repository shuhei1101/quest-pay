"use client"
import { RewardViewLayout } from "@/app/(app)/reward/_components/RewardViewLayout"
import { useChildAgeRewardTable, useChildLevelRewardTable } from "../_hooks/useChildReward"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { IconEdit } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { CHILD_REWARD_URL } from "@/app/(core)/endpoints"

type Props = {
  childId: string
}

/** 子供個別の報酬閲覧画面 */
export const ChildRewardView = ({ childId }: Props) => {
  const router = useRouter()
  
  // データを取得する
  const { data: ageData, isLoading: isAgeLoading } = useChildAgeRewardTable(childId)
  const { data: levelData, isLoading: isLevelLoading } = useChildLevelRewardTable(childId)

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
            onClick: () => router.push(CHILD_REWARD_URL(childId)),
            color: "violet"
          }
        ]}
      />
    </>
  )
}
